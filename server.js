require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sql, connectDB } = require("./db/dbconfig");

const app = express();
const PORT = process.env.PORT || 5000;

// 中介軟體
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

// 啟動資料庫連線
connectDB();

// 註冊會員
app.post("/api/register", async (req, res) => {
  const { email, password, name, phone } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await sql.query`INSERT INTO Users (Email, PasswordHash, Name, Phone) VALUES (${email}, ${passwordHash}, ${name}, ${phone})`;
    res.json({ message: "註冊成功" });
  } catch (err) {
    res.status(500).json({ error: "註冊失敗" });
  }
});

// 登入會員
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
      return res.status(401).json({ error: "帳號或密碼錯誤" });
    }

    const token = jwt.sign({ userID: user.UserID }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "登入成功", token });
  } catch (err) {
    res.status(500).json({ error: "登入失敗" });
  }
});

// 查詢商品
app.get("/api/products", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Products`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "無法獲取商品" });
  }
});

// 查詢購物車內容
app.post("/api/cart", async (req, res) => {
  const { cartItems } = req.body;
  try {
    const items = await Promise.all(
      cartItems.map(async (item) => {
        const result = await sql.query`SELECT * FROM Products WHERE ProductID = ${item.productID}`;
        return { ...result.recordset[0], quantity: item.quantity };
      })
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "無法查詢購物車" });
  }
});

// 訂單記錄
app.get("/api/orders", async (req, res) => {
  const userID = req.query.userID;
  try {
    const result = await sql.query`SELECT * FROM Orders WHERE UserID = ${userID} ORDER BY OrderDate DESC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "無法查詢訂單" });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器正在運行於 https://testd-feb2evd8hbg2d8f0.eastasia-01.azurewebsites.net`);
});

async function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartTable = document.getElementById("cart-items");

    let totalAmount = 0;

    for (const item of cartItems) {
        const response = await fetch(`/api/products/${item.productID}`);
        const product = await response.json();

        totalAmount += product.Price * item.quantity;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.Name}</td>
            <td>${item.quantity}</td>
            <td>$${product.Price}</td>
            <td>$${product.Price * item.quantity}</td>
            <td>
                <button class="btn btn-danger" onclick="removeFromCart(${product.ProductID})">移除</button>
            </td>
        `;
        cartTable.appendChild(row);
    }

    document.getElementById("total-amount").textContent = `總金額：$${totalAmount}`;
}

// 移除購物車商品
function removeFromCart(productID) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.productID !== productID);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

// 提交訂單
async function submitOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("請先登入！");
        return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) {
        alert("購物車為空！");
        return;
    }

    const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItems }),
    });

    if (response.ok) {
        alert("訂單已提交！");
        localStorage.removeItem("cart");
        window.location.href = "orders.html";
    } else {
        alert("提交訂單失敗！");
    }
}

// 初始化頁面
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

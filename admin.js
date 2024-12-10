// 商品管理：新增商品
async function addProduct() {
    const name = prompt("輸入商品名稱：");
    const price = prompt("輸入商品價格：");
    const stock = prompt("輸入商品庫存數量：");
    const imageURL = prompt("輸入商品圖片 URL：");

    if (name && price && stock && imageURL) {
        const response = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, stock, imageURL }),
        });

        if (response.ok) {
            alert("商品新增成功！");
            document.getElementById("products-tab").click(); // 重新載入商品列表
        } else {
            alert("新增商品失敗！");
        }
    }
}

// 商品管理：編輯商品
async function editProduct(productID) {
    const name = prompt("修改商品名稱：");
    const price = prompt("修改商品價格：");
    const stock = prompt("修改商品庫存數量：");
    const imageURL = prompt("修改商品圖片 URL：");

    if (name && price && stock && imageURL) {
        const response = await fetch(`/api/admin/products/${productID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, stock, imageURL }),
        });

        if (response.ok) {
            alert("商品修改成功！");
            document.getElementById("products-tab").click(); // 重新載入商品列表
        } else {
            alert("修改商品失敗！");
        }
    }
}

// 商品管理：刪除商品
async function deleteProduct(productID) {
    if (confirm("確定要刪除此商品嗎？")) {
        const response = await fetch(`/api/admin/products/${productID}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("商品刪除成功！");
            document.getElementById("products-tab").click(); // 重新載入商品列表
        } else {
            alert("刪除商品失敗！");
        }
    }
}

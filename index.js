// 動態加載商品
async function loadProducts() {
    const productList = document.getElementById("product-list");
    const response = await fetch("/api/products");
    const products = await response.json();

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "col-md-4";
        productCard.innerHTML = `
            <div class="card mb-4">
                <img src="${product.ImageURL}" class="card-img-top" alt="${product.Name}">
                <div class="card-body">
                    <h5 class="card-title">${product.Name}</h5>
                    <p class="card-text">價格：$${product.Price}</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.ProductID}, '${product.Name}')">加入購物車</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// 加入購物車
function addToCart(productID, productName) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.productID === productID);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ productID, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`已將 "${productName}" 加入購物車！`);
}

// 初始化頁面
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

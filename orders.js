async function loadOrders() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("請先登入！");
        window.location.href = "login.html";
        return;
    }

    const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
    });

    const orders = await response.json();
    const ordersTable = document.getElementById("orders-list");

    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.OrderID}</td>
            <td>${new Date(order.OrderDate).toLocaleDateString()}</td>
            <td>$${order.TotalAmount}</td>
            <td><button class="btn btn-info" onclick="viewOrderDetails(${order.OrderID})">查看明細</button></td>
        `;
        ordersTable.appendChild(row);
    });
}

// 查看訂單明細
async function viewOrderDetails(orderID) {
    const response = await fetch(`/api/orders/${orderID}`);
    const orderDetails = await response.json();
    alert(JSON.stringify(orderDetails, null, 2));
}

// 初始化頁面
document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

<?php
// 資料庫連線設定
$serverName = "qoo.database.windows.net";
$database = "DB";
$username = "tsou36";
$password = "Aa123456";

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "連線失敗: " . $e->getMessage()]));
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        login($conn);
        break;
    case 'register':
        register($conn);
        break;
    case 'getProducts':
        getProducts($conn);
        break;
    case 'addToCart':
        addToCart($conn);
        break;
    case 'createOrder':
        createOrder($conn);
        break;
    case 'getOrders':
        getOrders($conn);
        break;
    default:
        echo json_encode(["error" => "無效的操作"]);
}

// 登入功能
function login($conn) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$username || !$password) {
        echo json_encode(["error" => "請提供帳號和密碼"]);
        return;
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND password = ?");
    $stmt->execute([$username, $password]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["success" => true, "message" => "登入成功", "user_id" => $user['id']]);
    } else {
        echo json_encode(["error" => "帳號或密碼錯誤"]);
    }
}

// 註冊功能
function register($conn) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$username || !$password) {
        echo json_encode(["error" => "請提供帳號和密碼"]);
        return;
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["error" => "帳號已存在"]);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    try {
        $stmt->execute([$username, $password]);
        echo json_encode(["success" => true, "message" => "註冊成功"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "註冊失敗: " . $e->getMessage()]);
    }
}

// 獲取商品
function getProducts($conn) {
    $stmt = $conn->query("SELECT * FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
}

// 加入購物車功能（範例）
function addToCart($conn) {
    $productId = $_POST['product_id'] ?? '';
    $quantity = $_POST['quantity'] ?? 1;

    if (!$productId) {
        echo json_encode(["error" => "請提供商品 ID"]);
        return;
    }

    echo json_encode(["success" => true, "message" => "商品已加入購物車"]);
}

// 建立訂單
const response = await fetch('https://qqw-cqe5eugtb3ahf5a8.canadacentral-01.azurewebsites.net/backend_api.php?action=createOrder');

function createOrder($conn) {
    $userId = $_POST['user_id'] ?? '';
    $cartItems = json_decode($_POST['cart_items'] ?? '[]', true);

    if (!$userId || empty($cartItems)) {
        echo json_encode(["error" => "缺少用戶 ID 或購物車內容"]);
        return;
    }

    try {
        $conn->beginTransaction();

        $stmt = $conn->prepare("INSERT INTO orders (user_id, created_at) VALUES (?, GETDATE())");
        $stmt->execute([$userId]);
        $orderId = $conn->lastInsertId();

        $stmt = $conn->prepare("INSERT INTO order_details (order_id, product_id, quantity) VALUES (?, ?, ?)");
        foreach ($cartItems as $item) {
            $stmt->execute([$orderId, $item['product_id'], $item['quantity']]);
        }

        $conn->commit();
        echo json_encode(["success" => true, "message" => "訂單建立成功"]);
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode(["error" => "訂單建立失敗: " . $e->getMessage()]);
    }
}

// 獲取訂單紀錄
function getOrders($conn) {
    $userId = $_GET['user_id'] ?? '';
    if (!$userId) {
        echo json_encode(["error" => "缺少用戶 ID"]);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM orders WHERE user_id = ?");
    $stmt->execute([$userId]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
}
?>

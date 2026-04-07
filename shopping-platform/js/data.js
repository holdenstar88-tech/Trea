// 商品数据
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 7999,
        originalPrice: 8999,
        image: "https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPhone+15+Pro",
        category: "手机",
        description: "A17 Pro芯片，钛金属设计，4800万像素主摄",
        rating: 4.9,
        sales: 10000,
        stock: 50
    },
    {
        id: 2,
        name: "MacBook Air M3",
        price: 8999,
        originalPrice: 9999,
        image: "https://via.placeholder.com/300x300/333333/FFFFFF?text=MacBook+Air",
        category: "电脑",
        description: "M3芯片，轻薄便携，18小时续航",
        rating: 4.8,
        sales: 5000,
        stock: 30
    },
    {
        id: 3,
        name: "AirPods Pro 2",
        price: 1899,
        originalPrice: 2299,
        image: "https://via.placeholder.com/300x300/666666/FFFFFF?text=AirPods+Pro",
        category: "配件",
        description: "主动降噪，空间音频，MagSafe充电盒",
        rating: 4.7,
        sales: 20000,
        stock: 100
    },
    {
        id: 4,
        name: "iPad Air 5",
        price: 4799,
        originalPrice: 5499,
        image: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=iPad+Air",
        category: "平板",
        description: "M1芯片，10.9英寸Liquid视网膜显示屏",
        rating: 4.8,
        sales: 8000,
        stock: 40
    },
    {
        id: 5,
        name: "Apple Watch Series 9",
        price: 2999,
        originalPrice: 3499,
        image: "https://via.placeholder.com/300x300/FF9500/FFFFFF?text=Apple+Watch",
        category: "配件",
        description: "双指互点两下，健康监测，运动追踪",
        rating: 4.6,
        sales: 12000,
        stock: 60
    },
    {
        id: 6,
        name: "Sony WH-1000XM5",
        price: 2499,
        originalPrice: 2999,
        image: "https://via.placeholder.com/300x300/2C2C2C/FFFFFF?text=Sony+耳机",
        category: "配件",
        description: "业界领先的降噪，30小时续航",
        rating: 4.7,
        sales: 6000,
        stock: 45
    },
    {
        id: 7,
        name: "Nintendo Switch OLED",
        price: 2599,
        originalPrice: 2899,
        image: "https://via.placeholder.com/300x300/E60012/FFFFFF?text=Switch+OLED",
        category: "游戏",
        description: "7英寸OLED屏幕，64GB存储",
        rating: 4.9,
        sales: 15000,
        stock: 80
    },
    {
        id: 8,
        name: "小米14 Pro",
        price: 4999,
        originalPrice: 5499,
        image: "https://via.placeholder.com/300x300/FF6900/FFFFFF?text=小米14+Pro",
        category: "手机",
        description: "骁龙8 Gen3，徕卡影像，120W快充",
        rating: 4.6,
        sales: 9000,
        stock: 70
    }
];

// 分类数据
const categories = [
    { id: "all", name: "全部商品", icon: "🛍️" },
    { id: "手机", name: "手机数码", icon: "📱" },
    { id: "电脑", name: "电脑办公", icon: "💻" },
    { id: "配件", name: "数码配件", icon: "🎧" },
    { id: "平板", name: "平板电脑", icon: "📟" },
    { id: "游戏", name: "游戏娱乐", icon: "🎮" }
];

// 购物车数据存储
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 用户数据
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// 保存购物车到本地存储
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 保存用户登录状态
function saveUser() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// 添加到购物车
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    saveCart();
    updateCartCount();
    return true;
}

// 从购物车移除
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
}

// 更新购物车商品数量
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
        }
    }
    updateCartCount();
}

// 清空购物车
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

// 获取购物车总价
function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// 获取购物车商品数量
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// 更新购物车数量显示
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = getCartItemCount();
    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

// 用户登录
function login(username, password) {
    // 模拟登录验证
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = { username: user.username, email: user.email };
        saveUser();
        return true;
    }
    return false;
}

// 用户注册
function register(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
        return { success: false, message: '用户名已存在' };
    }
    
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: '注册成功' };
}

// 用户登出
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

// 检查登录状态
function checkLogin() {
    return currentUser !== null;
}

// 格式化价格
function formatPrice(price) {
    return '¥' + price.toFixed(2);
}

// 页面加载时更新购物车数量
document.addEventListener('DOMContentLoaded', updateCartCount);

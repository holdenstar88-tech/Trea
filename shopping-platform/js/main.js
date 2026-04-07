// 当前选中的分类
let currentCategory = 'all';
let currentSort = 'default';

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    initCategoryList();
    renderProducts();
    initCarousel();
    updateUserLink();
    
    // 搜索框回车事件
    document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
});

// 初始化分类列表
function initCategoryList() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    categoryList.innerHTML = categories.map(cat => `
        <div class="category-item ${cat.id === 'all' ? 'active' : ''}" 
             onclick="selectCategory('${cat.id}')">
            <span class="category-icon">${cat.icon}</span>
            <span>${cat.name}</span>
        </div>
    `).join('');
}

// 选择分类
function selectCategory(categoryId) {
    currentCategory = categoryId;
    
    // 更新分类样式
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    renderProducts();
}

// 渲染商品列表
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // 过滤商品
    let filteredProducts = currentCategory === 'all' 
        ? [...products] 
        : products.filter(p => p.category === currentCategory);
    
    // 搜索过滤
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // 排序
    filteredProducts = sortProductsList(filteredProducts, currentSort);
    
    // 渲染商品卡片
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #999;">
                <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
                <p>暂无相关商品</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="rating-text">${product.rating}分 | 已售${formatNumber(product.sales)}</span>
                </div>
                <div class="product-price-row">
                    <div class="product-price">
                        <span class="current-price">${formatPrice(product.price)}</span>
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartHandler(${product.id})">
                        🛒
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 排序商品
function sortProductsList(products, sortType) {
    const sorted = [...products];
    switch(sortType) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'sales':
            sorted.sort((a, b) => b.sales - a.sales);
            break;
        default:
            // 默认排序（按id）
            break;
    }
    return sorted;
}

// 排序按钮点击
function sortProducts(sortType) {
    currentSort = sortType;
    
    // 更新按钮样式
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderProducts();
}

// 搜索商品
function searchProducts() {
    renderProducts();
}

// 查看商品详情
function viewProduct(productId) {
    window.location.href = `pages/product.html?id=${productId}`;
}

// 添加到购物车处理
function addToCartHandler(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        addToCart(productId, 1);
        showToast(`已添加 ${product.name} 到购物车`, 'success');
    } else {
        showToast('商品库存不足', 'error');
    }
}

// 获取星级显示
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '☆';
    }
    return stars;
}

// 格式化数字
function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
}

// 显示消息提示
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 初始化轮播图
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    
    setInterval(() => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
    }, 5000);
}

// 更新用户链接
function updateUserLink() {
    const userLink = document.getElementById('userLink');
    if (!userLink) return;
    
    if (checkLogin()) {
        userLink.innerHTML = `👤 ${currentUser.username}`;
        userLink.href = '#';
        userLink.onclick = function(e) {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) {
                logout();
                window.location.reload();
            }
        };
    } else {
        userLink.innerHTML = '👤 登录';
        userLink.href = 'pages/login.html';
    }
}

// Dados dos Produtos
const products = [
    {
        id: 1,
        name: "Anel Gala de Ametista",
        price: 2500.00,
        image: "assets/images/ring1.png",
        category: "aneis",
        description: "Um deslumbrante anel com uma ametista central de corte profundo, cercada por cristais que capturam a luz de forma divina."
    },
    {
        id: 2,
        name: "Colar Aurora de Ouro",
        price: 4800.00,
        image: "assets/images/necklace1.png",
        category: "colares",
        description: "Inspirado no primeiro raio de sol, este colar em ouro 18k apresenta um design fluido e elegante para ocasiões especiais."
    },
    {
        id: 3,
        name: "Brincos de Cristal Ethereal",
        price: 1200.00,
        image: "assets/images/earrings1.png",
        category: "brincos",
        description: "Leves e sofisticados, estes brincos de cristal pendentes trazem um toque de magia e brilho ao seu visual diário."
    },
    {
        id: 4,
        name: "Solitário Diamond Glow",
        price: 8500.00,
        image: "assets/images/ring1.png",
        category: "aneis",
        description: "O clássico atemporal. Um diamante solitário de claridade excepcional em uma cravação de ouro branco que realça sua grandiosidade."
    },
    {
        id: 5,
        name: "Gargantilha de Pérolas",
        price: 3200.00,
        image: "assets/images/necklace1.png",
        category: "colares",
        description: "Pérolas naturais selecionadas a dedo, unidas em uma gargantilha que exala classe e sofisticação discreta."
    },
    {
        id: 6,
        name: "Brincos de Diamante Puros",
        price: 5900.00,
        image: "assets/images/earrings1.png",
        category: "brincos",
        description: "Simplicidade e luxo em par. Diamantes de corte brilhante que oferecem um vislumbre de perfeição em cada movimento."
    }
];

let cart = JSON.parse(localStorage.getItem('dg-cart')) || [];

// Seletores DOM
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('product-search');
const searchBox = document.getElementById('search-box');
const searchIcon = document.getElementById('search-icon');
const cartIcon = document.getElementById('cart-icon');
const cartDrawer = document.getElementById('cart-drawer');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const totalPriceEl = document.getElementById('total-price');
const cartCountEl = document.getElementById('cart-count');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Modais
const loginIcon = document.getElementById('login-icon');
const loginModal = document.getElementById('login-modal');
const closeLogin = document.getElementById('close-login');
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const productDetailContent = document.getElementById('product-detail-content');

// Mobile Selectors
const mobileSearchBtn = document.getElementById('mobile-search-btn');
const mobileCartBtn = document.getElementById('mobile-cart-btn');

// --- Renderizar Produtos ---
function renderProducts(items) {
    productList.innerHTML = '';
    
    if (items.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum produto encontrado.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img" onclick="openProductDetail(${product.id})">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div class="add-to-cart" onclick="addToCart(${product.id})">Adicionar ao Carrinho</div>
            </div>
        `;
        productList.appendChild(card);
    });
}

// --- Busca ---
function handleSearch(query) {
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filtered);
}

searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

searchIcon.addEventListener('click', () => {
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) {
        searchInput.focus();
    }
});

mobileSearchBtn.addEventListener('click', () => {
    searchBox.classList.toggle('active');
    window.scrollTo({ top: productList.offsetTop - 150, behavior: 'smooth' });
    searchInput.focus();
});

// --- Carrinho ---
function openCartDrawer() {
    cartDrawer.classList.add('active');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('active');
}

cartIcon.addEventListener('click', openCartDrawer);
mobileCartBtn.addEventListener('click', openCartDrawer);
closeCart.addEventListener('click', closeCartDrawer);

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    openCartDrawer();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    localStorage.setItem('dg-cart', JSON.stringify(cart));
    renderCartItems();
    updateCartBadge();
}

function renderCartItems() {
    const emptyMsg = document.getElementById('empty-cart-msg');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.appendChild(emptyMsg);
        emptyMsg.style.display = 'block';
        totalPriceEl.innerText = 'R$ 0,00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.quantity}x R$ ${item.price.toLocaleString('pt-BR')}</p>
                <span onclick="removeFromCart(${item.id})" style="color: red; cursor: pointer; font-size: 0.8rem;">Remover</span>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    totalPriceEl.innerText = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function updateCartBadge() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (count > 0) {
        cartCountEl.innerText = count;
        cartCountEl.style.display = 'block';
    } else {
        cartCountEl.style.display = 'none';
    }
}

// --- Modais ---
function openProductDetail(id) {
    const product = products.find(p => p.id === id);
    productDetailContent.innerHTML = `
        <div class="product-detail-layout">
            <div class="product-detail-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p class="price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p class="product-description">${product.description}</p>
                <div class="modal-actions">
                    <button class="btn-buy" onclick="buyNow(${product.id})">Comprar Agora</button>
                    <button class="btn-add-cart" onclick="addToCart(${product.id}); closeModals();">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    `;
    productModal.classList.add('active');
}

function buyNow(id) {
    addToCart(id);
    closeModals();
    openCartDrawer();
}

function closeModals() {
    productModal.classList.remove('active');
    loginModal.classList.remove('active');
}

loginIcon.addEventListener('click', () => loginModal.classList.add('active'));
closeLogin.addEventListener('click', closeModals);
closeProductModal.addEventListener('click', closeModals);

// Fecha modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === productModal) {
        closeModals();
    }
});

// --- Carrossel ---
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

document.getElementById('next-btn').addEventListener('click', nextSlide);
document.getElementById('prev-btn').addEventListener('click', prevSlide);

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
});

// Autoplay carrossel
setInterval(nextSlide, 5000);

// --- Troca de Tema ---
function initTheme() {
    const savedTheme = localStorage.getItem('dg-theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('dg-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeToggle.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeToggle.classList.replace('fa-sun', 'fa-moon');
    }
}

themeToggle.addEventListener('click', toggleTheme);

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderProducts(products);
    updateCart();
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

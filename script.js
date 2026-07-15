// ---- Constants ----
const PRICE = 399.99;
const MAX_QTY = 5;

// ---- State variables ----
let cart = [];
let qty = 1;

// ---- DOM Elements ----
const mainImg = document.getElementById('mainImg');
const sectorBtns = document.querySelectorAll('.sector-btn');
const qtyNum = document.getElementById('qtyNum');
const qtyUp = document.getElementById('qtyUp');
const qtyDown = document.getElementById('qtyDown');
const addToCartBtn = document.getElementById('addToCartBtn');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const progressFill = document.getElementById('progressFill');
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const successMsg = document.getElementById('successMsg');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// ---- Sidebar telemetry indicators ----
const diagQty = document.getElementById('diag-qty');
const diagSubtotal = document.getElementById('diag-subtotal');
const systemStatus = document.getElementById('system-status');

// ---- Smooth Scroll Navigation ----
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ---- Image Sector Gallery ----
sectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        
        sectorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        mainImg.src = btn.getAttribute('data-src');
    });
});

// ---- Quantity Buffering ----
qtyUp.addEventListener('click', () => {
    if (qty < MAX_QTY) {
        qty++;
        qtyNum.textContent = qty;
        diagQty.textContent = qty.toString().padStart(2, '0');
    } else {
        alert('Maximum of 5 units allowed per tactical batch transmission.');
    }
});

qtyDown.addEventListener('click', () => {
    if (qty > 1) {
        qty--;
        qtyNum.textContent = qty;
        diagQty.textContent = qty.toString().padStart(2, '0');
    }
});

// ---- Cart Drawer controls ----
function openCart() {
    cartDrawer.classList.add('open');
    overlay.classList.add('show');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('show');
}

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', closeCartDrawer);

// ---- Add to Cart operation ----
addToCartBtn.addEventListener('click', () => {
    let existingItem = cart.find(item => item.name === 'Auris Pro X');
    
    if (existingItem) {
        if (existingItem.qty + qty <= MAX_QTY) {
            existingItem.qty += qty;
        } else {
            alert(`Cannot exceed ${MAX_QTY} units in cart cache.`);
            return;
        }
    } else {
        cart.push({
            name: 'Auris Pro X',
            price: PRICE,
            qty: qty
        });
    }
    
    qty = 1;
    qtyNum.textContent = 1;
    diagQty.textContent = '01';
    
    renderCart();
    openCart();
});

// ---- Render Cart contents ----
function renderCart() {
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Update cart indicators
    cartBtn.textContent = `CART [${totalItems}]`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">CART DATABANK IS EMPTY.</p>';
        checkoutBtn.disabled = true;
        cartSubtotal.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
        diagSubtotal.textContent = '$399.99'; // Default unit price preview
        return;
    }
    
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-top">
                <span class="cart-item-name">${item.name}</span>
                <button class="cart-item-remove" data-index="${index}">REMOVE</button>
            </div>
            <div class="cart-item-bottom">
                <span class="cart-item-qty">Qty: ${item.qty}</span>
                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });
    
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    diagSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutBtn.disabled = false;
    
    // Wire up remove handlers
    const removeBtns = cartItems.querySelectorAll('.cart-item-remove');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            cart.splice(idx, 1);
            renderCart();
        });
    });
}

// ---- Checkout simulation flow ----
checkoutBtn.addEventListener('click', () => {
    closeCartDrawer();
    
    // Reset modal states instantly
    modal.classList.add('show');
    progressFill.style.width = '100%';
    closeModal.classList.remove('hidden');
    document.getElementById('modal-title').textContent = 'ORDER LOGGED SUCCESSFUL!';
    systemStatus.textContent = 'NOMINAL';
    systemStatus.style.color = '';
});

// Close modal & finalize order
closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    cart = [];
    renderCart();
    progressFill.style.width = '0%';
});

// ---- Newsletter Form submission ----
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (emailInput.value.trim() !== '') {
        successMsg.classList.remove('hidden');
        emailInput.value = '';
        
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 5000);
    }
});

// ---- Theme toggle (Light Mode override) ----
function applyTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light-mode');
        themeToggleBtn.textContent = 'LIGHTS: ON';
        themeToggleBtn.classList.remove('btn-butterscotch');
        themeToggleBtn.classList.add('btn-bluey');
    } else {
        document.body.classList.remove('light-mode');
        themeToggleBtn.textContent = 'LIGHTS: OFF';
        themeToggleBtn.classList.remove('btn-bluey');
        themeToggleBtn.classList.add('btn-butterscotch');
    }
}

themeToggleBtn.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light-mode');
    applyTheme(!isCurrentlyLight);
});

// Initial load check
const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
applyTheme(prefersLight.matches);
prefersLight.addEventListener('change', (e) => applyTheme(e.matches));

// ---- Mobile Hamburger Menu Toggle ----
const menuToggleBtn = document.getElementById('menuToggleBtn');
const leftFrame = document.querySelector('.left-frame');
if (menuToggleBtn && leftFrame) {
    menuToggleBtn.addEventListener('click', () => {
        leftFrame.classList.toggle('menu-open');
        if (leftFrame.classList.contains('menu-open')) {
            menuToggleBtn.textContent = '✕';
        } else {
            menuToggleBtn.textContent = '☰';
        }
    });

    // Close mobile menu when a navigation item is clicked
    const navPanels = leftFrame.querySelectorAll('.panel');
    navPanels.forEach(panel => {
        panel.addEventListener('click', () => {
            leftFrame.classList.remove('menu-open');
            menuToggleBtn.textContent = '☰';
        });
    });
}

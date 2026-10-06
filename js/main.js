// 1. BASE DE DATOS DE PRODUCTOS
const products = [
  { id: 1, name: "Laptop Mac", category: "Tecnología", price: 55000, icon: "💻" },
  { id: 2, name: "Kitchen Mixer", category: "Hogar", price: 25000, icon: "🥣" },
  { id: 3, name: "Zapatillas Sport", category: "Moda", price: 20000, icon: "👟" },
  { id: 4, name: "Balón de Fútbol", category: "Deportes", price: 10000, icon: "⚽" },
  { id: 5, name: "Audífonos Bluetooth", category: "Tecnología", price: 18000, icon: "🎧" },
  { id: 6, name: "Cafetera Expreso", category: "Hogar", price: 32000, icon: "☕" }
];

// Cargar carrito desde LocalStorage o inicializar vacío
let cart = JSON.parse(localStorage.getItem('ff_cart')) || [];

// 2. REFERENCIAS A ELEMENTOS DEL DOM
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const maxPriceInput = document.getElementById('maxPriceInput');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const catBtn = document.getElementById('catBtn');
const catMenu = document.getElementById('catMenu');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

// 3. RENDERIZAR PRODUCTOS EN LA GRILLA
function renderProducts(items) {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  
  if (items.length === 0) {
    productsGrid.innerHTML = '<p style="color:#94a3b8">No se encontraron productos.</p>';
    return;
  }
  
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="product-badge">${p.category}</span>
      <div class="product-img">${p.icon}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">$${p.price.toLocaleString('es-CL')}</div>
      <button class="btn-add" onclick="addToCart(${p.id})">Añadir al carrito</button>
    `;
    productsGrid.appendChild(card);
  });
}

// 4. MOSTRAR NOTIFICACIÓN TOAST
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// 5. FUNCIONALIDADES DEL CARRITO
function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const prod = products.find(p => p.id === id);
    if (prod) {
      cart.push({ ...prod, qty: 1 });
    }
  }
  saveAndUpdateCart();
  showToast('¡Producto añadido al carrito!');
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  saveAndUpdateCart();
}

function saveAndUpdateCart() {
  localStorage.setItem('ff_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = totalQty;
  if (!cartItems) return;

  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color:#94a3b8; text-align:center;">El carrito está vacío</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small style="color:#38bdf8">$${item.price.toLocaleString('es-CL')}</small>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <strong>$${(item.price * item.qty).toLocaleString('es-CL')}</strong>
      `;
      cartItems.appendChild(div);
    });
  }
  if (cartTotal) cartTotal.textContent = `$${total.toLocaleString('es-CL')}`;
}

// 6. FILTROS Y BÚSQUEDA
function applyFilters() {
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const maxPrice = maxPriceInput && maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search);
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesPrice;
  });

  renderProducts(filtered);
}

// 7. EVENT LISTENERS
if (searchInput) searchInput.addEventListener('input', applyFilters);
if (maxPriceInput) maxPriceInput.addEventListener('input', applyFilters);

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    renderProducts(products);
  });
}

document.querySelectorAll('.cat-filter').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cat = e.target.dataset.category || e.target.parentElement.dataset.category;
    const filtered = products.filter(p => p.category === cat);
    if (catMenu) catMenu.classList.remove('show');
    renderProducts(filtered);
  });
});

if (catBtn) {
  catBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (catMenu) catMenu.classList.toggle('show');
  });
}

if (cartBtn && cartDrawer) {
  cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
}

if (closeCart && cartDrawer) {
  closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));
}

document.addEventListener('click', (e) => {
  if (catMenu && catBtn && !catMenu.contains(e.target) && !catBtn.contains(e.target)) {
    catMenu.classList.remove('show');
  }
});

// 8. INICIALIZACIÓN
renderProducts(products);
updateCartUI();
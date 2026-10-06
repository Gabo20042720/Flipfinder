let products = [];
let cart = JSON.parse(localStorage.getItem('ff_cart')) || [];

// 1. OBTENER PRODUCTOS DESDE SUPABASE
async function fetchProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid) {
    productsGrid.innerHTML = '<p style="color:#666">Cargando productos...</p>';
  }

  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true);

    if (error) throw error;

    products = data || [];
    renderProducts(products);
  } catch (error) {
    console.error('Error al cargar productos:', error.message);
    if (productsGrid) {
      productsGrid.innerHTML = '<p style="color:#e11d48">Error al cargar el catálogo de productos.</p>';
    }
  }
}

// 2. RENDERIZAR PRODUCTOS
function renderProducts(items) {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  
  if (items.length === 0) {
    productsGrid.innerHTML = '<p style="color:#666">No hay productos disponibles.</p>';
    return;
  }
  
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Si la imagen es una URL o un emoji
    const imageContent = p.imagen && p.imagen.startsWith('http') 
      ? `<img src="${p.imagen}" alt="${p.nombre}" style="max-height:100px; object-fit:contain;">`
      : `<div class="product-img">${p.imagen || '📦'}</div>`;

    card.innerHTML = `
      <span class="product-badge">${p.categoria || 'General'}</span>
      ${imageContent}
      <div class="product-name">${p.nombre}</div>
      <div class="product-price">$${Number(p.precio).toLocaleString('es-CL')}</div>
      <button class="btn-add" onclick="addToCart('${p.id}')">Añadir al carrito</button>
    `;
    productsGrid.appendChild(card);
  });
}

// 3. FUNCIONES DEL CARRITO
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
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = totalQty;
  if (!cartItems) return;

  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color:#666; text-align:center; padding:2rem 0;">El carrito está vacío</p>';
  } else {
    cart.forEach(item => {
      const itemTotal = item.precio * item.qty;
      total += itemTotal;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>
          <strong>${item.nombre}</strong><br>
          <small style="color:#009EE3">$${Number(item.precio).toLocaleString('es-CL')}</small>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <strong>$${itemTotal.toLocaleString('es-CL')}</strong>
      `;
      cartItems.appendChild(div);
    });
  }
  if (cartTotal) cartTotal.textContent = `$${total.toLocaleString('es-CL')}`;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// 4. BÚSQUEDA Y FILTROS
const searchInput = document.getElementById('searchInput');
const maxPriceInput = document.getElementById('maxPriceInput');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

function applyFilters() {
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const maxPrice = maxPriceInput && maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;

  const filtered = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(search);
    const matchesPrice = p.precio <= maxPrice;
    return matchesSearch && matchesPrice;
  });

  renderProducts(filtered);
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
if (maxPriceInput) maxPriceInput.addEventListener('input', applyFilters);

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    renderProducts(products);
  });
}

// 5. EVENT LISTENERS DEL CARRITO LATERAL
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');

if (cartBtn && cartDrawer) {
  cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
}

if (closeCart && cartDrawer) {
  closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));
}

// INICIALIZAR
fetchProducts();
updateCartUI();
// ===== Carrito (guardado en localStorage) =====
const CART_KEY = 'cart';
const CART_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const cartCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

function cartEscape(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY));
        if (!Array.isArray(cart)) return [];
        // Descarta productos de pruebas antiguas (ids viejos como "9534")
        return cart.filter(item => CART_UUID_RE.test(String(item.id)));
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function showToast(mensaje) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.setAttribute('role', 'status');
        toast.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#222;color:#fff;padding:12px 20px;border-radius:6px;font-size:.95rem;z-index:1000;opacity:0;transition:opacity .2s;pointer-events:none;';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

// Agregar producto (las imágenes se guardan con ruta desde la raíz del sitio)
function addToCart(id, nombre, precio, imagen, stock) {
    const cart = getCart();
    const limite = Number(stock) > 0 ? Number(stock) : Infinity;
    const existing = cart.find(item => String(item.id) === String(id));

    if (existing) {
        if ((existing.quantity || 1) >= limite) {
            showToast('Ya tienes el máximo disponible de este producto');
            return;
        }
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({
            id: id,
            nombre: nombre,
            precio: Number(precio),
            imagen: (imagen || 'img/placeholder.jpg').replace(/^(\.\.\/)+/, ''),
            stock: Number(stock) || null,
            quantity: 1
        });
    }

    saveCart(cart);
    showToast('Producto agregado al carrito');
}

function updateCartCount() {
    const totalItems = getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('#cart-count, .cart-count').forEach(elem => {
        elem.textContent = totalItems;
    });
}

function changeQuantity(index, delta) {
    const cart = getCart();
    const item = cart[index];
    if (!item) return;

    const nueva = (item.quantity || 1) + delta;
    if (nueva < 1) return removeFromCart(index);
    if (item.stock && nueva > item.stock) {
        showToast('No hay más unidades disponibles');
        return;
    }
    item.quantity = nueva;
    saveCart(cart);
    renderCart();
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// Lista del carrito (checkout)
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartView = document.getElementById('empty-cart-view');
    const cartContent = document.getElementById('cart-content');

    if (!cartItemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        if (emptyCartView) emptyCartView.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyCartView) emptyCartView.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const qty = item.quantity || 1;
        const itemTotal = (item.precio || 0) * qty;
        total += itemTotal;

        return `
            <div class="cart-item" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #eee;">
                <img src="${cartEscape(item.imagen)}" alt="${cartEscape(item.nombre)}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
                <div style="flex-grow:1;margin-left:15px;">
                    <h4 style="margin:0;">${cartEscape(item.nombre)}</h4>
                    <p style="margin:5px 0;color:#666;">${cartCLP.format(item.precio)} c/u</p>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <button onclick="changeQuantity(${index}, -1)" aria-label="Quitar una unidad" style="width:28px;height:28px;cursor:pointer;">−</button>
                        <span>${qty}</span>
                        <button onclick="changeQuantity(${index}, 1)" aria-label="Agregar una unidad" style="width:28px;height:28px;cursor:pointer;">+</button>
                    </div>
                </div>
                <div style="font-weight:bold;margin-right:15px;">${cartCLP.format(itemTotal)}</div>
                <button onclick="removeFromCart(${index})" aria-label="Eliminar producto" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:18px;">&times;</button>
            </div>
        `;
    }).join('');

    if (cartTotalElement) cartTotalElement.textContent = cartCLP.format(total);
}

// Botones "Agregar al carrito" (portada y detalle). Captura el clic aunque otro script lo detenga.
document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-agregar');
    if (!btn || btn.hasAttribute('onclick')) return; // si el HTML ya trae su propio onclick, no duplicar

    e.preventDefault(); // evita que el enlace de la tarjeta navegue

    const lista = (typeof productos !== 'undefined') ? productos : [];
    const producto = lista.find(p => String(p.id) === String(btn.dataset.id));
    if (!producto) return;

    addToCart(producto.id, producto.nombre, producto.precio, producto.imagenes[0], producto.stock);
}, true);

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});

// Compatibilidad con botones antiguos
window.agregarAlCarrito = addToCart;
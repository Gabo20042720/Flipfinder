// Obtener productos guardados en el carrito
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Guardar productos en el carrito
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Agregar un producto al carrito
function addToCart(product) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert('¡Producto agregado al carrito!');
}

// Actualizar el número del carrito en la barra superior
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Renderizar lista en la página de carrito/checkout
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    if (!cartContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
        if (totalContainer) totalContainer.textContent = '$0';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        const itemTotal = (item.precio || item.price || 0) * (item.quantity || 1);
        total += itemTotal;
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagen || item.image || 'img/placeholder.jpg'}" alt="${item.nombre || item.title}">
                <div class="item-details">
                    <h4>${item.nombre || item.title}</h4>
                    <p>Cantidad: ${item.quantity || 1}</p>
                    <p>Precio: $${(item.precio || item.price || 0).toLocaleString('es-CL')}</p>
                </div>
            </div>
        `;
    }).join('');

    if (totalContainer) {
        totalContainer.textContent = `$${total.toLocaleString('es-CL')}`;
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});
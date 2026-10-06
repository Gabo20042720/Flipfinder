// Obtener el carrito desde localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Guardar el carrito en localStorage y actualizar contadores
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Función global para agregar productos al carrito
function addToCart(id, nombre, precio, imagen) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({
            id: id,
            nombre: nombre,
            precio: Number(precio),
            imagen: imagen || 'img/placeholder.jpg',
            quantity: 1
        });
    }

    saveCart(cart);
    alert('¡Producto agregado al carrito!');
}

// Actualizar el número de items en la barra superior
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
    
    cartCountElements.forEach(elem => {
        if (elem) elem.textContent = totalItems;
    });
}

// Renderizar la lista de productos en checkout.html
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
        const itemTotal = (item.precio || 0) * (item.quantity || 1);
        total += itemTotal;

        return `
            <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <img src="${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
                <div style="flex-grow: 1; margin-left: 15px;">
                    <h4 style="margin: 0;">${item.nombre}</h4>
                    <p style="margin: 5px 0; color: #666;">$${Number(item.precio).toLocaleString('es-CL')} x ${item.quantity}</p>
                </div>
                <div style="font-weight: bold; margin-right: 15px;">
                    $${itemTotal.toLocaleString('es-CL')}
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
        `;
    }).join('');

    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }
}

// Eliminar un producto del carrito
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// Inicializar al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});
// Alias para mantener compatibilidad con los botones del HTML
window.agregarAlCarrito = addToCart;
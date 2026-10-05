// Gestión Global del Carrito en FlipFinder
const CART_KEY = 'flipfinder_cart';

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

async function agregarAlCarrito(productoId) {
  try {
    const { data: producto, error } = await supabase
      .from('productos')
      .select('id, nombre, precio, imagen')
      .eq('id', productoId)
      .single();

    if (error || !producto) {
      alert('No se pudo agregar el producto.');
      return;
    }

    let cart = getCart();
    const index = cart.findIndex(item => item.id === producto.id);

    if (index > -1) {
      cart[index].cantidad += 1;
    } else {
      cart.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      });
    }

    saveCart(cart);
    alert(`¡"${producto.nombre}" se agregó al carrito!`);
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
  }
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const cartLinks = document.querySelectorAll('.header-actions a[href*="checkout"], .header-actions a[href*="cart"]');

  cartLinks.forEach(link => {
    link.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Carrito (${totalItems})`;
  });
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
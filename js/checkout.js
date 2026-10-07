// Checkout: valida el formulario y crea el pedido en Supabase.
// El total NO se calcula aquí: lo calcula la función crear_pedido() en la base de datos
// con los precios reales de la tabla products.
(function () {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const btn = document.getElementById('ck-submit');
  const errorBox = document.getElementById('ck-error');

  function mostrarError(mensaje) {
    errorBox.textContent = mensaje;
    errorBox.style.display = 'block';
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function limpiarError() {
    errorBox.textContent = '';
    errorBox.style.display = 'none';
  }

  function validar(d) {
    if (d.nombre.length < 2) return 'Escribe tu nombre.';
    if (d.apellido.length < 2) return 'Escribe tu apellido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Escribe un correo válido.';
    if (!/^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(d.telefono)) return 'Escribe un celular chileno válido, por ejemplo +56 9 1234 5678.';
    if (!d.region) return 'Selecciona tu región.';
    if (d.comuna.length < 2) return 'Escribe tu comuna.';
    if (d.direccion.length < 5) return 'Escribe tu dirección completa (calle y número).';
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarError();

    const cart = getCart();
    if (cart.length === 0) {
      mostrarError('Tu carrito está vacío.');
      return;
    }

    const v = (name) => (form.elements[name].value || '').trim();
    const datos = {
      nombre: v('nombre'),
      apellido: v('apellido'),
      email: v('email'),
      telefono: v('telefono'),
      region: v('region'),
      comuna: v('comuna'),
      direccion: v('direccion'),
      notas: v('notas')
    };

    const problema = validar(datos);
    if (problema) {
      mostrarError(problema);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const { data, error } = await window.supabaseClient.rpc('crear_pedido', {
      p_nombre: datos.nombre,
      p_apellido: datos.apellido,
      p_email: datos.email,
      p_telefono: datos.telefono,
      p_region: datos.region,
      p_comuna: datos.comuna,
      p_direccion: datos.direccion,
      p_notas: datos.notas,
      // Solo mandamos id y cantidad; el precio lo decide el servidor
      p_items: cart.map(item => ({ id: item.id, quantity: item.quantity || 1 }))
    });

    if (error) {
      console.error('Error creando el pedido:', error);
      mostrarError(error.message || 'No pudimos crear tu pedido. Inténtalo de nuevo.');
      btn.disabled = false;
      btn.textContent = 'Confirmar pedido';
      return;
    }

    const pedido = Array.isArray(data) ? data[0] : data;

    // Pedido creado: vaciamos el carrito y mostramos la confirmación
    localStorage.removeItem('cart');
    updateCartCount();

    document.getElementById('cart-content').style.display = 'none';
    document.getElementById('empty-cart-view').style.display = 'none';
    document.getElementById('order-ref').textContent = pedido ? pedido.out_ref : '';
    document.getElementById('order-done').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

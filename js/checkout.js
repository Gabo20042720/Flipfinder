// Checkout: valida el formulario, crea el pedido y redirige a Mercado Pago.
// Los precios y el total los calcula la función crear-pago en el servidor;
// aquí solo se envían los ids y cantidades del carrito.
(function () {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const btn = document.getElementById('ck-submit');
  const errorBox = document.getElementById('ck-error');
  const TEXTO_BOTON = 'Ir a pagar';

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

  function restaurarBoton() {
    btn.disabled = false;
    btn.textContent = TEXTO_BOTON;
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
    btn.textContent = 'Preparando tu pago...';

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/crear-pago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          ...datos,
          items: cart.map(item => ({ id: item.id, quantity: item.quantity || 1 }))
        })
      });

      const respuesta = await res.json().catch(() => ({}));

      if (!res.ok || !respuesta.init_point) {
        console.error('Error de crear-pago:', respuesta);
        mostrarError(respuesta.error || 'No pudimos iniciar el pago. Inténtalo de nuevo.');
        restaurarBoton();
        return;
      }

      // El carrito se vacía en gracias.html cuando el pago vuelve aprobado
      window.location.href = respuesta.init_point;
    } catch (err) {
      console.error(err);
      mostrarError('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
      restaurarBoton();
    }
  });
})();
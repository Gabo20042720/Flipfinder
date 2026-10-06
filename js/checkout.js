let cart = JSON.parse(localStorage.getItem('ff_cart')) || [];

// 1. CARGAR RESUMEN DEL PEDIDO
function renderCheckoutSummary() {
  const summaryContainer = document.getElementById('checkoutSummary');
  const totalContainer = document.getElementById('checkoutTotal');

  if (!summaryContainer) return;

  if (cart.length === 0) {
    summaryContainer.innerHTML = '<p style="color:#666">Tu carrito está vacío.</p>';
    if (totalContainer) totalContainer.textContent = '$0';
    return;
  }

  summaryContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.precio * item.qty;
    total += itemTotal;

    const div = document.createElement('div');
    div.style.cssText = 'display:flex; justify-content:space-between; margin-bottom:0.8rem; font-size:0.95rem;';
    div.innerHTML = `
      <div>
        <strong>${item.nombre}</strong> <span style="color:#666;">(x${item.qty})</span>
      </div>
      <div>$${itemTotal.toLocaleString('es-CL')}</div>
    `;
    summaryContainer.appendChild(div);
  });

  if (totalContainer) {
    totalContainer.textContent = `$${total.toLocaleString('es-CL')}`;
  }
}

// 2. PROCESAR FORMULARIO Y GUARDAR PEDIDO EN SUPABASE
const checkoutForm = document.getElementById('checkoutForm');

if (checkoutForm) {
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de pagar.');
      return;
    }

    const btnPay = document.getElementById('btnPay');
    btnPay.disabled = true;
    btnPay.textContent = 'Procesando pedido...';

    const orderData = {
      cliente_nombre: document.getElementById('fullName').value,
      cliente_email: document.getElementById('email').value,
      cliente_telefono: document.getElementById('phone').value,
      direccion: document.getElementById('address').value,
      ciudad: document.getElementById('city').value,
      productos: cart,
      total: cart.reduce((sum, item) => sum + (item.precio * item.qty), 0),
      estado: 'Pendiente'
    };

    try {
      const { data, error } = await window.supabaseClient
        .from('pedidos')
        .insert([orderData]);

      if (error) throw error;

      localStorage.removeItem('ff_cart');
      window.location.href = 'pago-exitoso.html';

    } catch (err) {
      console.error('Error al registrar pedido:', err.message);
      alert('Hubo un problema al procesar tu pedido. Intenta nuevamente.');
      btnPay.disabled = false;
      btnPay.textContent = 'Pagar con Mercado Pago';
    }
  });
}

// Inicializar al cargar la vista
renderCheckoutSummary();
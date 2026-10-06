document.addEventListener('DOMContentLoaded', async () => {
  const productosContainer = document.getElementById('productos-container');

  try {
    // Obtener la instancia de Supabase
    const client = window.supabaseClient || (typeof supabase !== 'undefined' ? supabase : null);

    if (!client || typeof client.from !== 'function') {
      console.error('El cliente de Supabase no se ha inicializado correctamente.');
      productosContainer.innerHTML = '<p class="error-mensaje">Error de configuración con la base de datos.</p>';
      return;
    }

    // Consultar la tabla de productos
    const { data: productos, error } = await client
      .from('productos')
      .select('*');

    if (error) {
      console.error('Error desde Supabase:', error);
      throw error;
    }

    if (!productos || productos.length === 0) {
      productosContainer.innerHTML = '<p class="no-productos">No hay productos disponibles por el momento.</p>';
      return;
    }

    // Limpiar contenedor y rendirizar tarjetas
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const precioFormateado = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
      }).format(producto.precio || 0);

      card.innerHTML = `
        <img src="${producto.imagen_url || 'https://via.placeholder.com/300'}" alt="${producto.nombre || 'Producto'}">
        <div class="product-info">
          <div class="product-price">${precioFormateado}</div>
          <h4 class="product-title">${producto.nombre || 'Sin título'}</h4>
          <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      `;

      productosContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Error al cargar productos:', err);
    if (productosContainer) {
      productosContainer.innerHTML = '<p class="error-mensaje">Ocurrió un error al cargar el catálogo de productos.</p>';
    }
  }
});
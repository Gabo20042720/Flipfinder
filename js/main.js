document.addEventListener('DOMContentLoaded', async () => {
  const productosContainer = document.getElementById('productos-container');

  try {
    // 1. Obtener los productos desde la tabla 'productos' de Supabase
    const { data: productos, error } = await supabase
      .from('productos')
      .select('*');

    if (error) {
      throw error;
    }

    // 2. Si no hay productos guardados
    if (!productos || productos.length === 0) {
      productosContainer.innerHTML = '<p class="no-productos">No hay productos disponibles por el momento.</p>';
      return;
    }

    // 3. Limpiar el contenedor de carga
    productosContainer.innerHTML = '';

    // 4. Generar cada tarjeta de producto estilo Mercado Libre
    productos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      // Formatear el precio a moneda chilena ($ CLP)
      const precioFormateado = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
      }).format(producto.precio || 0);

      card.innerHTML = `
        <img src="${producto.imagen_url || 'https://via.placeholder.com/300'}" alt="${producto.nombre}">
        <div class="product-info">
          <div class="product-price">${precioFormateado}</div>
          <h4 class="product-title">${producto.nombre}</h4>
          <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      `;

      productosContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Error al consultar productos en Supabase:', err);
    if (productosContainer) {
      productosContainer.innerHTML = '<p class="error-mensaje">Ocurrió un error al cargar el catálogo de productos.</p>';
    }
  }
});
document.addEventListener('DOMContentLoaded', async () => {
  const productosContainer = document.getElementById('productos-container');

  try {
    const client = window.supabaseClient || (typeof supabase !== 'undefined' ? supabase : null);

    if (!client) return;

    const { data: productos, error } = await client
      .from('productos')
      .select('*');

    if (error) throw error;

    if (!productos || productos.length === 0) {
      productosContainer.innerHTML = '<p class="no-productos">No hay productos disponibles por el momento.</p>';
      return;
    }

    productosContainer.innerHTML = '';

    productos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const precioFormateado = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
      }).format(producto.precio || 0);

      // Intentar obtener la imagen desde imagen_url o imagen
      const urlImagen = producto.imagen_url || producto.imagen || 'foto1,jpg';

      card.innerHTML = `
        <img src="${urlImagen}" alt="${producto.nombre || 'Producto'}" loading="lazy">
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
  }
});
document.addEventListener('DOMContentLoaded', async () => {
  const productosContainer = document.getElementById('productos-container');

  try {
    const client = window.supabaseClient || (typeof supabase !== 'undefined' ? supabase : null);

    if (!client) {
      console.error('El cliente de Supabase no está inicializado.');
      return;
    }

    const { data: productos, error } = await client
      .from('productos')
      .select('*');

    if (error) {
      console.error('Error al obtener productos:', error);
      if (productosContainer) {
        productosContainer.innerHTML = '<p class="error">Error al cargar productos.</p>';
      }
      return;
    }

    if (!productosContainer) return;

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

      // Extraer la primera foto correctamente desde JSONB, array o imagen_url
      let primeraImagen = 'https://via.placeholder.com/300';

      if (producto.imagenes) {
        if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
          primeraImagen = producto.imagenes[0];
        } else if (typeof producto.imagenes === 'string') {
          try {
            const parsed = JSON.parse(producto.imagenes);
            if (Array.isArray(parsed) && parsed.length > 0) primeraImagen = parsed[0];
          } catch (e) {
            primeraImagen = producto.imagenes;
          }
        }
      } else if (producto.imagen_url) {
        primeraImagen = producto.imagen_url;
      }

      card.innerHTML = `
        <a href="pages/product.html?id=${producto.id}" style="text-decoration: none; color: inherit;">
          <img src="${primeraImagen}" alt="${producto.nombre || 'Producto'}" loading="lazy">
          <div class="product-info">
            <div class="product-price">${precioFormateado}</div>
            <h4 class="product-title">${producto.nombre || 'Sin título'}</h4>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
          </div>
        </a>
      `;

      productosContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Error crítico:', err);
  }
});
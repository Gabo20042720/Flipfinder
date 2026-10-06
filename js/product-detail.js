document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = '../index.html';
    return;
  }

  try {
    const client = window.supabaseClient || (typeof supabase !== 'undefined' ? supabase : null);
    if (!client) return;

    const { data: producto, error } = await client
      .from('productos')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !producto) {
      console.error('Error al cargar detalle:', error);
      return;
    }

    // Renderizar información básica
    document.getElementById('product-title').textContent = producto.nombre || 'Producto';
    document.getElementById('product-description').textContent = producto.descripcion || 'Sin descripción disponible.';
    document.getElementById('product-stock').textContent = `Stock disponible: ${producto.stock || 0} unidades`;
    
    document.getElementById('product-price').textContent = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(producto.precio || 0);

    // Obtener lista de imágenes
    let fotos = [];
    if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
      fotos = producto.imagenes;
    } else if (producto.imagen_url) {
      fotos = [producto.imagen_url];
    } else {
      fotos = ['https://via.placeholder.com/400'];
    }

    // Cargar imagen principal y galería de miniaturas
    const mainImg = document.getElementById('main-product-img');
    const thumbnailsContainer = document.getElementById('thumbnails-container');

    mainImg.src = fotos[0];
    thumbnailsContainer.innerHTML = '';

    fotos.forEach((url, index) => {
      const thumb = document.createElement('img');
      thumb.src = url;
      thumb.alt = `Vista ${index + 1}`;
      thumb.classList.add('thumbnail-img');
      if (index === 0) thumb.classList.add('active');

      thumb.addEventListener('click', () => {
        mainImg.src = url;
        document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });

      thumbnailsContainer.appendChild(thumb);
    });

  } catch (err) {
    console.error('Error general:', err);
  }
});
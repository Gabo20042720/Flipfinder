// Detalle de producto: lee el producto desde Supabase según ?id=
let productos = []; // se mantiene el nombre por si cart.js lo usa

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

const ES_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Las rutas en la base son "img/foto1.jpg"; desde /pages/ hay que anteponer "../"
function rutaImagen(url) {
  if (!url) return '../img/placeholder.jpg';
  if (/^(https?:)?\/\//.test(url) || url.startsWith('/') || url.startsWith('../')) return url;
  return '../' + url;
}

async function cargarProducto(id) {
  let consulta = window.supabaseClient
    .from('products')
    .select('*')
    .eq('active', true);

  // Acepta el id nuevo (UUID) y también el código viejo de Dropi ("9534")
  consulta = ES_UUID.test(id) ? consulta.eq('id', id) : consulta.eq('dropi_id', id);

  const { data, error } = await consulta.maybeSingle();

  if (error) {
    console.error('Error cargando el producto:', error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    nombre: data.name,
    precio: data.price,
    categoria: data.category,
    stock: data.stock,
    descripcion: data.description,
    imagenes: (data.images || []).map(rutaImagen)
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const productId = new URLSearchParams(window.location.search).get('id');

  const titleEl = document.getElementById('product-title');
  const priceEl = document.getElementById('product-price');
  const descEl = document.getElementById('product-description');
  const stockEl = document.getElementById('product-stock');
  const mainImg = document.getElementById('main-product-img');
  const thumbnailsContainer = document.getElementById('thumbnails-container');

  if (!productId) {
    if (titleEl) titleEl.textContent = 'Producto no encontrado';
    return;
  }

  if (titleEl) titleEl.textContent = 'Cargando...';

  const producto = await cargarProducto(productId);

  if (!producto) {
    if (titleEl) titleEl.textContent = 'Producto no encontrado';
    if (descEl) descEl.textContent = 'Este producto ya no está disponible. Vuelve al inicio para ver otros.';
    return;
  }

  productos = [producto]; // para que cart.js pueda encontrarlo

  document.title = `${producto.nombre} | FlipFinder Chile`;
  if (titleEl) titleEl.textContent = producto.nombre;
  if (descEl) descEl.textContent = producto.descripcion || '';
  if (priceEl) priceEl.textContent = formatoCLP.format(producto.precio);
  if (stockEl) {
    stockEl.textContent = producto.stock > 0
      ? `Stock disponible: ${producto.stock} unidades`
      : 'Sin stock por ahora';
  }

  // Botón agregar al carrito (si existe en la página): le pasamos el id nuevo
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.dataset.id = producto.id;
    if (producto.stock <= 0) btn.disabled = true;
  });

  // Imagen principal y miniaturas
  if (mainImg && producto.imagenes.length > 0) {
    mainImg.src = producto.imagenes[0];
    mainImg.alt = producto.nombre;
  }

  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = '';
    producto.imagenes.forEach((url, index) => {
      const thumb = document.createElement('img');
      thumb.src = url;
      thumb.alt = `Vista ${index + 1} de ${producto.nombre}`;
      thumb.classList.add('thumbnail-img');
      if (index === 0) thumb.classList.add('active');

      thumb.addEventListener('click', () => {
        if (mainImg) mainImg.src = url;
        document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });

      thumbnailsContainer.appendChild(thumb);
    });
  }
});
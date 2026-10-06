// Productos cargados desde Supabase (misma forma que antes, para no romper cart.js ni product-detail.js)
let productos = [];

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

async function cargarProductos() {
  const { data, error } = await window.supabaseClient
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error cargando productos:', error);
    return [];
  }

  // Adaptamos los nombres de columnas a los que usaba tu código
  return data.map(p => ({
    id: p.id,
    nombre: p.name,
    precio: p.price,
    categoria: p.category,
    stock: p.stock,
    descripcion: p.description,
    imagenes: p.images || [],
    destacado: p.featured
  }));
}

function renderProductos(lista) {
  const contenedor = document.getElementById('productos-container');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = '<p>No hay productos disponibles por ahora.</p>';
    return;
  }

  lista.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const imagen = producto.imagenes[0] || 'img/placeholder.jpg';

    card.innerHTML = `
      <a href="pages/product.html?id=${encodeURIComponent(producto.id)}" style="text-decoration: none; color: inherit;">
        <img src="${escapeHtml(imagen)}" alt="${escapeHtml(producto.nombre)}" loading="lazy">
        <div class="product-info">
          <div class="product-price">${formatoCLP.format(producto.precio)}</div>
          <h4 class="product-title">${escapeHtml(producto.nombre)}</h4>
          <button class="btn-agregar" data-id="${escapeHtml(producto.id)}">Agregar al carrito</button>
        </div>
      </a>
    `;

    // Evita que el clic en el botón navegue a la página del producto
    card.querySelector('.btn-agregar').addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
    });

    contenedor.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('productos-container');
  if (!contenedor) return;

  contenedor.innerHTML = '<p>Cargando productos...</p>';
  productos = await cargarProductos();
  renderProductos(productos);
});
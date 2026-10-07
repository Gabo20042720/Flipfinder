// Portada: carga productos desde Supabase, filtra por categoría y busca por texto.
// "productos" es global porque cart.js lo usa para encontrar el producto al agregar.
let productos = [];
let categoriaActual = 'Todos';
let textoBusqueda = '';

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

function normalizar(t) {
  return (t || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

function filtrar() {
  const q = normalizar(textoBusqueda.trim());
  return productos.filter(p =>
    (categoriaActual === 'Todos' || p.categoria === categoriaActual) &&
    (!q || normalizar(`${p.nombre} ${p.categoria} ${p.descripcion}`).includes(q))
  );
}

function renderChips() {
  const cont = document.getElementById('categoria-chips');
  if (!cont) return;
  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  cont.innerHTML = '';
  categorias.forEach(cat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ff-chip';
    chip.textContent = cat;
    chip.setAttribute('aria-pressed', String(cat === categoriaActual));
    chip.addEventListener('click', () => {
      categoriaActual = cat;
      renderChips();
      renderProductos();
    });
    cont.appendChild(chip);
  });
}

function limpiarFiltros() {
  categoriaActual = 'Todos';
  textoBusqueda = '';
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  renderChips();
  renderProductos();
}

function renderProductos(lista = filtrar()) {
  const contenedor = document.getElementById('productos-container');
  const resultados = document.getElementById('resultados');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  if (resultados) resultados.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;

  if (lista.length === 0) {
    const vacio = document.createElement('div');
    vacio.className = 'ff-empty';
    vacio.innerHTML = '<p>No encontramos productos con esa búsqueda.</p><button type="button">Ver todos</button>';
    vacio.querySelector('button').addEventListener('click', limpiarFiltros);
    contenedor.appendChild(vacio);
    return;
  }

  lista.forEach(p => {
    const agotado = !(p.stock > 0);
    const pocas = !agotado && p.stock <= 5;
    const imagen = p.imagenes[0] || 'img/placeholder.jpg';

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a class="pc-link" href="pages/product.html?id=${encodeURIComponent(p.id)}">
        <div class="pc-media"><img src="${escapeHtml(imagen)}" alt="${escapeHtml(p.nombre)}" loading="lazy"></div>
        <div class="product-info">
          <div class="product-price">${formatoCLP.format(p.precio)}</div>
          <h3 class="product-title">${escapeHtml(p.nombre)}</h3>
          <div class="pc-badges">
            <span class="pc-badge pc-ship">Envío incluido</span>
            ${pocas ? '<span class="pc-badge pc-low">¡Últimas unidades!</span>' : ''}
          </div>
        </div>
      </a>
      <button class="btn-agregar" type="button" data-id="${escapeHtml(p.id)}" ${agotado ? 'disabled' : ''}>
        ${agotado ? 'Agotado' : 'Agregar al carrito'}
      </button>`;
    contenedor.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('productos-container');
  if (!contenedor) return;

  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  if (form && input) {
    form.addEventListener('submit', e => { e.preventDefault(); textoBusqueda = input.value; renderProductos(); });
    input.addEventListener('input', () => { textoBusqueda = input.value; renderProductos(); });
  }

  contenedor.innerHTML = '<p class="ff-empty">Cargando productos...</p>';
  productos = await cargarProductos();
  renderChips();
  renderProductos();
});

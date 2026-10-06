// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // Cargar productos al iniciar la página
  fetchProducts();
});

/**
 * Consulta la tabla 'productos' en Supabase y los muestra en pantalla
 */
async function fetchProducts() {
  const container = document.getElementById('productsContainer');

  try {
    // Usamos el cliente asignado globalmente en supabase-config.js
    const { data: productos, error } = await window.supabaseClient
      .from('productos')
      .select('*')
      .eq('activo', true);

    if (error) {
      console.error('Error al consultar productos en Supabase:', error);
      if (container) {
        container.innerHTML = '<p class="error">Ocurrió un error al cargar el catálogo.</p>';
      }
      return;
    }

    if (!productos || productos.length === 0) {
      if (container) {
        container.innerHTML = '<p>No hay productos disponibles actualmente.</p>';
      }
      return;
    }

    // Dibujar las tarjetas de productos
    renderProducts(productos);

  } catch (err) {
    console.error('Error inesperado:', err);
    if (container) {
      container.innerHTML = '<p class="error">No se pudo conectar con el servidor.</p>';
    }
  }
}

/**
 * Renderiza la lista de productos en el HTML
 * @param {Array} productos Lista de objetos producto
 */
function renderProducts(productos) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  container.innerHTML = productos.map(prod => `
    <div class="product-card" data-id="${prod.id}">
      <img src="${prod.imagen || 'img/placeholder.png'}" alt="${prod.nombre}" loading="lazy" />
      <h3>${prod.nombre}</h3>
      <p class="description">${prod.descripcion || 'Sin descripción disponible.'}</p>
      <p class="price">$${Number(prod.precio).toLocaleString('es-CL')}</p>
      <button onclick="addToCart('${prod.id}')">Agregar al carrito</button>
    </div>
  `).join('');
}

/**
 * Ejemplo de función base para agregar al carrito
 * @param {string|number} productId ID del producto seleccionado
 */
function addToCart(productId) {
  console.log(`Producto ${productId} agregado al carrito.`);
  // Aquí puedes vincular la lógica con js/cart.js si corresponde
}
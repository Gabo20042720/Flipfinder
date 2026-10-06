// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // Cargar los productos una vez cargado el DOM
  fetchProducts();
});

/**
 * Consulta la tabla 'productos' en Supabase y los muestra en pantalla
 */
async function fetchProducts() {
  const container = document.getElementById('productsContainer');

  try {
    // Usamos la instancia global configurada en js/supabase-config.js
    const { data: productos, error } = await window.supabaseClient
      .from('productos')
      .select('*')
      .eq('activo', true);

    if (error) {
      console.error('Error al consultar productos en Supabase:', error);
      if (container) {
        container.innerHTML = '<p class="error">Ocurrió un error al cargar el catálogo de productos.</p>';
      }
      return;
    }

    if (!productos || productos.length === 0) {
      if (container) {
        container.innerHTML = '<p>No hay productos disponibles por el momento.</p>';
      }
      return;
    }

    // Renderizar las tarjetas de productos
    renderProducts(productos);

  } catch (err) {
    console.error('Error inesperado:', err);
    if (container) {
      container.innerHTML = '<p class="error">No se pudo conectar con el servidor.</p>';
    }
  }
}

/**
 * Genera el HTML de las tarjetas de productos en la grilla del catálogo
 * @param {Array} productos Lista de objetos producto provenientes de Supabase
 */
function renderProducts(productos) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  container.innerHTML = productos.map(prod => {
    // Recortar descripciones extensas para mantener tarjetas uniformes
    const desc = prod.descripcion || '';
    const descCorta = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;

    return `
      <div class="product-card" data-id="${prod.id}">
        <div class="product-img-wrapper">
          <img src="${prod.imagen || 'img/placeholder.png'}" alt="${prod.nombre}" loading="lazy" />
        </div>
        <div class="product-info">
          <h3 class="product-title">${prod.nombre}</h3>
          <p class="description">${descCorta || 'Sin descripción disponible.'}</p>
          <div class="product-footer">
            <span class="price">$${Number(prod.precio).toLocaleString('es-CL')}</span>
            <button class="btn-add-cart" onclick="addToCart('${prod.id}')">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Función para añadir un producto al carrito de compras
 * @param {string} productId ID único del producto
 */
function addToCart(productId) {
  console.log(`Producto con ID ${productId} agregado al carrito.`);
  // Si tienes una función global en js/cart.js, puedes vincularla aquí
}
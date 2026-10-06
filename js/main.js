// Lista de productos con tus imágenes locales de la carpeta img/
const productos = [
  {
    id: "9534",
    nombre: "Auriculares Gamer Micrófono Off Ruido",
    precio: 23400,
    categoria: "Tecnología",
    stock: 499,
    descripcion: "¡Sumérgete en la experiencia de juego! Auriculares gamer con micrófono omnidireccional con cancelación de ruido.",
    imagenes: [
      "img/foto1.jpg",
      "img/foto2.jpg",
      "img/foto3.jpg",
      "img/foto4.jpg",
      "img/foto5.jpg"
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const productosContainer = document.getElementById('productos-container');

  if (!productosContainer) return;

  productosContainer.innerHTML = '';

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const precioFormateado = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(producto.precio);

    const primeraImagen = producto.imagenes[0];

    card.innerHTML = `
      <a href="pages/product.html?id=${producto.id}" style="text-decoration: none; color: inherit;">
        <img src="${primeraImagen}" alt="${producto.nombre}" loading="lazy">
        <div class="product-info">
          <div class="product-price">${precioFormateado}</div>
          <h4 class="product-title">${producto.nombre}</h4>
          <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      </a>
    `;

    productosContainer.appendChild(card);
  });
});
// Misma lista local para la vista de detalle
const productos = [
  {
    id: "9534",
    nombre: "Auriculares Gamer Micrófono Off Ruido",
    precio: 23400,
    categoria: "Tecnología",
    stock: 499,
    descripcion: "¡Sumérgete en la experiencia de juego! Auriculares gamer con micrófono omnidireccional con cancelación de ruido.",
    imagenes: [
      "../img/foto1.jpg",
      "../img/foto2.jpg",
      "../img/foto3.jpg",
      "../img/foto4.jpg",
      "../img/foto5.jpg"
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || "9534";

  const producto = productos.find(p => p.id === productId);

  if (!producto) return;

  // Cargar datos del producto
  const titleEl = document.getElementById('product-title');
  const priceEl = document.getElementById('product-price');
  const descEl = document.getElementById('product-description');
  const stockEl = document.getElementById('product-stock');
  const mainImg = document.getElementById('main-product-img');
  const thumbnailsContainer = document.getElementById('thumbnails-container');

  if (titleEl) titleEl.textContent = producto.nombre;
  if (descEl) descEl.textContent = producto.descripcion;
  if (stockEl) stockEl.textContent = `Stock disponible: ${producto.stock} unidades`;
  if (priceEl) {
    priceEl.textContent = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(producto.precio);
  }

  // Cargar imagen principal y miniaturas de la galería
  if (mainImg && producto.imagenes.length > 0) {
    mainImg.src = producto.imagenes[0];
  }

  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = '';
    producto.imagenes.forEach((url, index) => {
      const thumb = document.createElement('img');
      thumb.src = url;
      thumb.alt = `Vista ${index + 1}`;
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
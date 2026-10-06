// js/main.js

document.addEventListener('DOMContentLoaded', async () => {
    const productosContainer = document.getElementById('productos-container') || document.querySelector('.productos-grid');

    if (!productosContainer) {
        console.error('No se encontró el contenedor de productos en el HTML.');
        return;
    }

    try {
        // Consultar la tabla de productos en Supabase
        const { data: productos, error } = await window.supabaseClient
            .from('productos')
            .select('*');

        if (error) {
            throw error;
        }

        // Si no hay productos guardados en la BD
        if (!productos || productos.length === 0) {
            productosContainer.innerHTML = '<p class="no-productos">No hay productos disponibles por el momento.</p>';
            return;
        }

        // Limpiar el contenedor antes de renderizar
        productosContainer.innerHTML = '';

        // Generar la tarjeta para cada producto
        productos.forEach(producto => {
            // Manejar la imagen: toma la primera foto si hay saltos de línea o comas
            let imagenUrl = 'img/placeholder.jpg';
            if (producto.imagen) {
                // Separa por salto de línea (\n) o por coma (,) y toma el primer elemento
                imagenUrl = producto.imagen.split(/[\n,]/)[0].trim();
            }

            // Formatear precio a CLP
            const precioFormateado = new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                maximumFractionDigits: 0
            }).format(producto.precio || 0);

            // Crear el elemento de la tarjeta
            const card = document.createElement('div');
            card.classList.add('producto-card');

            card.innerHTML = `
                <div class="producto-imagen">
                    <img src="${imagenUrl}" alt="${producto.nombre || 'Producto'}" onerror="this.src='img/placeholder.jpg'">
                </div>
                <div class="producto-info">
                    <h3 class="producto-titulo">${producto.nombre || 'Sin título'}</h3>
                    <p class="producto-descripcion">${producto.descripcion || ''}</p>
                    <div class="producto-precio-container">
                        <span class="producto-precio">${precioFormateado}</span>
                    </div>
                    <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
                </div>
            `;

            productosContainer.appendChild(card);
        });

    } catch (err) {
        console.error('Error al consultar productos en Supabase:', err);
        productosContainer.innerHTML = '<p class="error-mensaje">Ocurrió un error al cargar el catálogo de productos.</p>';
    }
});
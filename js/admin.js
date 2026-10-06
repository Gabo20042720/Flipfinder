// 1. CARGAR PEDIDOS DESDE SUPABASE
async function loadOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  try {
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    tbody.innerHTML = '';
    if (!pedidos || pedidos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay pedidos aún.</td></tr>';
      return;
    }

    pedidos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.cliente_nombre || 'N/A'}</strong></td>
        <td>${p.cliente_email || ''}<br><small>${p.cliente_telefono || ''}</small></td>
        <td>${p.direccion || ''}, ${p.ciudad || ''}</td>
        <td><strong>$${Number(p.total || 0).toLocaleString('es-CL')}</strong></td>
        <td><span class="badge-status">${p.estado || 'Pendiente'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar pedidos:', err.message);
  }
}

// 2. CARGAR PRODUCTOS Y OPCIÓN DE ELIMINAR
async function loadAdminProducts() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  try {
    const { data: productos, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    tbody.innerHTML = '';
    productos.forEach(prod => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${prod.imagen && prod.imagen.startsWith('http') ? `<img src="${prod.imagen}" width="30">` : prod.imagen}</td>
        <td>${prod.nombre}</td>
        <td>${prod.categoria}</td>
        <td>$${Number(prod.precio).toLocaleString('es-CL')}</td>
        <td>
          <button onclick="deleteProduct('${prod.id}')" style="background:#E11D48; color:#fff; border:none; padding:0.4rem 0.8rem; border-radius:6px; cursor:pointer;">
            Eliminar
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar productos:', err.message);
  }
}

// 3. AGREGAR NUEVO PRODUCTO
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newProduct = {
      nombre: document.getElementById('prodName').value,
      categoria: document.getElementById('prodCategory').value,
      precio: parseFloat(document.getElementById('prodPrice').value),
      imagen: document.getElementById('prodImage').value,
      activo: true
    };

    try {
      const { error } = await supabase.from('productos').insert([newProduct]);
      if (error) throw error;

      alert('¡Producto agregado con éxito!');
      addProductForm.reset();
      loadAdminProducts();
    } catch (err) {
      alert('Error al agregar producto: ' + err.message);
    }
  });
}

// 4. ELIMINAR PRODUCTO
async function deleteProduct(id) {
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    try {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) throw error;
      loadAdminProducts();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  }
}

// Inicializar
loadOrders();
loadAdminProducts();
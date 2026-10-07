// Datos de contacto: edita SOLO estas dos líneas. Si dejas una vacía, se oculta sola.
const SITE_CORREO = 'flipfinderchile@gmail.com';
const SITE_WHATSAPP = '56958256823';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-mail]').forEach(el => {
    if (!SITE_CORREO) return el.closest('[data-contact]')?.remove();
    el.href = 'mailto:' + SITE_CORREO; el.textContent = SITE_CORREO;
  });
  document.querySelectorAll('[data-wa]').forEach(el => {
    if (!SITE_WHATSAPP) return el.closest('[data-contact]')?.remove();
    el.href = 'https://wa.me/' + SITE_WHATSAPP + '?text=' + encodeURIComponent('Hola FlipFinder, tengo una consulta');
  });
});

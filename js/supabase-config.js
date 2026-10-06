// Configuración de Supabase
const SUPABASE_URL = 'https://nwtzzcxmpaxiyihjxdin.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx'; // Copia la clave entera de tu pantalla

// Inicializar cliente CDN de Supabase usando variable global
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
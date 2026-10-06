// js/supabase-config.js

const SUPABASE_URL = 'https://nwtzzcxmpaxiyihjxdin.supabase.co/rest/v1/productos';
const SUPABASE_ANON_KEY = 'sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx'; // Coloca aquí tu clave anon_key de Supabase

// Crear la instancia del cliente y asignarla globalmente
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
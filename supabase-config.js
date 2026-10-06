const SUPABASE_URL = "https://nwtzzcxmpaxiyihjxdin.supabase.co";
// Pega aquí la clave 'anon public' copiada de la pestaña Legacy:
const SUPABASE_ANON_KEY = "sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx";

// Inicializamos el cliente oficial de Supabase
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Guardamos en window.supabase para que index.html y product.html lo usen directamente
window.supabase = client;
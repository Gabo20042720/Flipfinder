// Reemplaza con tu URL y Tu Anon Key de Supabase si es necesario
const SUPABASE_URL = 'NEXT_PUBLIC_SUPABASE_URL=https://nwtzzcxmpaxiyihjxdin.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx';

// Inicialización del cliente global
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;
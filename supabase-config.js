var SUPABASE_URL = "https://nwtzzcxmpaxiyihjxdin.supabase.co";

// Pega aquí la clave que empieza por eyJ...
var SUPABASE_ANON_KEY = "sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx";

if (window.supabase && typeof window.supabase.createClient === 'function') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
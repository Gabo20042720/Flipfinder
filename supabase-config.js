var SUPABASE_URL = "https://nwtzzcxmpaxiyihjxdin.supabase.co";
var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZgsxNyLJk8Bteys0Qp2uLQ_nFF5eBBx";

// Inicializamos el cliente oficial y reemplazamos window.supabase
if (window.supabase && typeof window.supabase.createClient === 'function') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
} else if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
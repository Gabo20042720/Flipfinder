const SUPABASE_URL = "https://nwtzzcxmpaxiyihjxdin.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZgsxNyLJk8Bteys0Qp2uLQ_nFF5eBBx";

// Crear el cliente de Supabase
const _supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Asignar a la variable global 'supabase' que usan index, product y cart
window.supabase = _supabase;
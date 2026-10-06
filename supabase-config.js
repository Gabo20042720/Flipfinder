const SUPABASE_URL = "https://nwtzzcxmpaxiyihjxdin.supabase.co";

// Pega dentro de las comillas la clave que empieza por eyJ... copiada de Legacy anon:
const SUPABASE_ANON_KEY = "sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx";

// Guardamos la referencia a la librería cargada en HTML
const supabaseLib = window.supabase;

// Creamos e inicializamos el cliente
const client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Lo dejamos disponible globalmente
window.supabase = client;
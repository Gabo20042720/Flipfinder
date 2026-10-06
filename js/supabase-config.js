// Reemplaza con tus valores reales de Supabase
const SUPABASE_URL = 'NEXT_PUBLIC_SUPABASE_URL=https://nwtzzcxmpaxiyihjxdin.supabase.co'; // Tu URL de Supabase
const SUPABASE_ANON_KEY = 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx';

// Inicializar cliente CDN de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const SUPABASE_URL = "https://nwtzzcxmpaxiyihjxdin.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZgsxNyLJk8BteysOQp2uLQ_nFF5eBBx";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

window.supabaseClient = supabaseClient;
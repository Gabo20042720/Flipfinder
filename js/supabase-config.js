var SUPABASE_URL = "https://nwtzzcxmpaxiyihjxdin.supabase.co";

// Pega aquí la clave que empieza por eyJ...
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHp6Y3htcGF4aXlpaGp4ZGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MTI5MzAsImV4cCI6MjEwNjM4ODkzMH0.usjd485mhbSfCDAR7mxZQr9WN8oeRWXkHJdmpv1bSoU";

if (window.supabase && typeof window.supabase.createClient === 'function') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
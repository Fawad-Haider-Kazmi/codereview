from supabase import create_client, Client
from config import settings

def get_supabase() -> Client:
    """Anon client — respects Row Level Security (frontend-safe)."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_admin() -> Client:
    """Service role client — bypasses RLS (backend-only, use for inserts)."""
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_KEY
    )

# 🔥 IMPORTANT FIX:
# Use ADMIN client for backend operations that fail due to RLS
supabase: Client = get_supabase_admin()

# Keep anon client for optional future use (frontend auth flows)
supabase_anon: Client = get_supabase()
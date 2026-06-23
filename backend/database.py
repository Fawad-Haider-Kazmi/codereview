from supabase import create_client, Client
from config import settings

def get_supabase() -> Client:
    """Anon client — respects Row Level Security."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_admin() -> Client:
    """Service role client — bypasses RLS (use carefully)."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

supabase: Client       = get_supabase()
supabase_admin: Client = get_supabase_admin()
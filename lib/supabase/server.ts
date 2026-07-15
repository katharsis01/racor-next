import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseServerClient: SupabaseClient | null | undefined;

/**
 * Cliente de lectura para Route Handlers y Server Components.
 *
 * Se inicializa al usarlo, no al importar el módulo, para que `next build`
 * también funcione cuando las variables se inyectan solo en ejecución.
 */
export function getSupabaseServerClient() {
  if (supabaseServerClient !== undefined) return supabaseServerClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !publishableKey) {
    supabaseServerClient = null;
    return supabaseServerClient;
  }

  supabaseServerClient = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return supabaseServerClient;
}

import { createClient } from "@supabase/supabase-js";

/**
 * Cliente para lecturas desde el cliente (si hiciera falta).
 * En este MVP lo usamos solo desde el server.
 */
export const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Cliente con SERVICE_ROLE para ejecutar mutaciones desde el backend.
 * ¡Nunca expongas esta clave al cliente!
 */
export const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

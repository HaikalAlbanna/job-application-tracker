import { createClient } from "@supabase/supabase-js";

function readEnv(key: string): string | undefined {
  const importMetaEnv = typeof import.meta !== "undefined" ? (import.meta.env as Record<string, string | undefined> | undefined) : undefined;
  const metaValue = importMetaEnv?.[key];
  if (typeof metaValue === "string" && metaValue.trim().length > 0) return metaValue;

  const processValue = typeof process !== "undefined" ? process.env?.[key] : undefined;
  if (typeof processValue === "string" && processValue.trim().length > 0) return processValue;

  return undefined;
}

export function getSupabaseClient() {
  if (typeof window === "undefined") return null;

  const supabaseUrl = readEnv("VITE_SUPABASE_URL");
  const supabaseAnonKey = readEnv("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing. App will run without database until Vercel env vars are configured.");
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = typeof window !== "undefined" ? getSupabaseClient() : null;

import { getSupabaseClient } from "./supabase";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignUpInput = AuthCredentials & {
  fullName?: string;
};

export async function signUpWithEmail({ email, password, fullName }: SignUpInput) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName ?? "",
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }: AuthCredentials) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function resetPasswordForEmail(email: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }

  const redirectTo = `${window.location.origin}/auth/reset-password`;
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }

  const { data, error } = await client.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export async function exchangeResetCode(code: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }

  const { data, error } = await client.auth.exchangeCodeForSession(code);
  if (error) throw error;
  return data;
}

export async function getCurrentSession() {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function subscribeAuthState(listener: (session: unknown) => void) {
  const client = getSupabaseClient();
  if (!client) {
    listener(null);
    return () => {};
  }

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    listener(session);
  });

  return () => data.subscription.unsubscribe();
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const SUPABASE_ENABLED = Boolean(url && anon);

export const supabase: SupabaseClient | null = SUPABASE_ENABLED
	? createClient(url, anon, {
			auth: {
				persistSession: true,
				autoRefreshToken: true,
				detectSessionInUrl: true,
				storageKey: "enc-auth",
				flowType: "pkce",
			},
		})
	: null;

export function requireSupabase(): SupabaseClient {
	if (!supabase) {
		throw new Error(
			"Supabase no está configurado. Agrega PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en .env (ver .env.example).",
		);
	}
	return supabase;
}

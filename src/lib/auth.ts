import type { Provider, User } from "@supabase/supabase-js";
import { requireSupabase } from "./supabase";

export type AuthProvider = "google" | "twitter" | "twitch";

export async function signInWith(provider: AuthProvider): Promise<void> {
	const sb = requireSupabase();
	const scopes =
		provider === "twitch"
			? "user:read:email"
			: provider === "twitter"
				? undefined
				: "email profile";
	const { error } = await sb.auth.signInWithOAuth({
		provider: provider as Provider,
		options: {
			redirectTo: `${window.location.origin}/`,
			...(scopes ? { scopes } : {}),
		},
	});
	if (error) throw error;
}

export async function signOut(): Promise<void> {
	const sb = requireSupabase();
	const { error } = await sb.auth.signOut();
	if (error) throw error;
}

export async function getUser(): Promise<User | null> {
	const sb = requireSupabase();
	const { data } = await sb.auth.getUser();
	return data.user ?? null;
}

export function onAuthChange(callback: (user: User | null) => void) {
	const sb = requireSupabase();
	const { data } = sb.auth.onAuthStateChange((_event, session) => {
		callback(session?.user ?? null);
	});
	return data.subscription;
}

export function getDisplayName(user: User | null): string {
	if (!user) return "";
	const meta = (user.user_metadata || {}) as Record<string, unknown>;
	const candidates = [
		"full_name",
		"name",
		"preferred_username",
		"user_name",
	];
	for (const key of candidates) {
		const v = meta[key];
		if (typeof v === "string" && v.trim().length > 0) return v;
	}
	if (user.email) return user.email.split("@")[0];
	return "";
}

export function getAvatarUrl(user: User | null): string | null {
	if (!user) return null;
	const meta = (user.user_metadata || {}) as Record<string, unknown>;
	const v = meta.avatar_url ?? meta.picture;
	return typeof v === "string" && v.length > 0 ? v : null;
}

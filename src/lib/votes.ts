import type { PostgrestError, User } from "@supabase/supabase-js";
import { requireSupabase } from "./supabase";

export type Side = "p1" | "p2";

export interface Vote {
	id: string;
	user_id: string | null;
	tag: string;
	side: Side;
	amount: number;
	voter_name: string | null;
	voter_avatar: string | null;
	created_at: string;
}

export interface InsertVoteArgs {
	tag: string;
	side: Side;
	amount: number;
}

export async function fetchRecentVotes(limit = 8): Promise<Vote[]> {
	const sb = requireSupabase();
	const { data, error } = await sb
		.from("votes")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(limit);
	if (error) throw error;
	return (data ?? []) as Vote[];
}

export async function countVotes(): Promise<number> {
	const sb = requireSupabase();
	const { count, error } = await sb
		.from("votes")
		.select("*", { count: "exact", head: true });
	if (error) throw error;
	return count ?? 0;
}

export async function countVotesBySide(): Promise<{ p1: number; p2: number }> {
	const sb = requireSupabase();
	const { data, error } = await sb.from("votes").select("side");
	if (error) throw error;
	let p1 = 0;
	let p2 = 0;
	for (const row of data ?? []) {
		if (row.side === "p1") p1++;
		else if (row.side === "p2") p2++;
	}
	return { p1, p2 };
}

export async function fetchMyVote(userId: string): Promise<Vote | null> {
	const sb = requireSupabase();
	const { data, error } = await sb
		.from("votes")
		.select("*")
		.eq("user_id", userId)
		.maybeSingle();
	if (error && error.code !== "PGRST116") throw error;
	return (data ?? null) as Vote | null;
}

export async function insertVote(
	args: InsertVoteArgs,
	user: User | null,
): Promise<Vote> {
	const sb = requireSupabase();
	if (!user) {
		throw new Error("Debes iniciar sesión para votar.");
	}
	const payload = {
		user_id: user.id,
		tag: args.tag,
		side: args.side,
		amount: args.amount,
		voter_name:
			(user.user_metadata as Record<string, unknown>)?.full_name ??
			(user.user_metadata as Record<string, unknown>)?.name ??
			null,
		voter_avatar:
			(user.user_metadata as Record<string, unknown>)?.avatar_url ??
			(user.user_metadata as Record<string, unknown>)?.picture ??
			null,
	};
	const { data, error } = await sb
		.from("votes")
		.insert(payload)
		.select()
		.single();
	if (error) throw error;
	return data as Vote;
}

export function subscribeVotes(callback: (vote: Vote) => void) {
	const sb = requireSupabase();
	const channel = sb
		.channel("votes-stream")
		.on(
			"postgres_changes",
			{ event: "INSERT", schema: "public", table: "votes" },
			(payload) => {
				const next = payload.new as Vote;
				callback(next);
			},
		)
		.subscribe();
	return () => {
		sb.removeChannel(channel);
	};
}

export function isUniqueViolation(error: PostgrestError | Error): boolean {
	const code = (error as PostgrestError).code;
	return code === "23505";
}

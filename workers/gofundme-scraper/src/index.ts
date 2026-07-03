export interface Env {
	GFM_DATA: KVNamespace;
}

const CAMPAIGN_URL =
	"https://www.gofundme.com/f/venezuela-fg-community-earthquake-relief";
const KV_KEY = "campaign";
const KV_TTL_SECONDS = 60 * 60;
const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export interface CampaignData {
	raised: number;
	goal: number;
	percent: number;
	donors: number;
	source: "scrape" | "fallback";
	updatedAt: string;
}

const CORS_HEADERS: Record<string, string> = {
	"content-type": "application/json; charset=utf-8",
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, OPTIONS",
	"cache-control": "public, max-age=60",
};

export default {
	async scheduled(
		_event: ScheduledController,
		env: Env,
		ctx: ExecutionContext,
	): Promise<void> {
		ctx.waitUntil(refresh(env));
	},
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (request.method === "OPTIONS") {
			return new Response(null, { headers: CORS_HEADERS });
		}
		if (url.pathname !== "/api/gofundme") {
			return new Response("Not found", {
				status: 404,
				headers: CORS_HEADERS,
			});
		}
		const stored = await env.GFM_DATA.get(KV_KEY);
		if (!stored) {
			return new Response(
				JSON.stringify({ error: "no data yet — first run pending" }),
				{ status: 503, headers: CORS_HEADERS },
			);
		}
		return new Response(stored, { headers: CORS_HEADERS });
	},
};

async function refresh(env: Env): Promise<void> {
	try {
		const res = await fetch(CAMPAIGN_URL, {
			headers: {
				"User-Agent": USER_AGENT,
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
				"Accept-Language": "en-US,en;q=0.9,es;q=0.8",
			},
			cf: { cacheTtl: 0, cacheEverything: false },
		});
		if (!res.ok) {
			console.error(`[scraper] HTTP ${res.status}`);
			return;
		}
		const html = await res.text();
		const data = parse(html);
		if (!data) {
			console.error("[scraper] parse failed — check wrangler tail");
			return;
		}
		const payload: CampaignData = {
			...data,
			source: "scrape",
			updatedAt: new Date().toISOString(),
		};
		await env.GFM_DATA.put(KV_KEY, JSON.stringify(payload), {
			expirationTtl: KV_TTL_SECONDS,
		});
		console.log(
			`[scraper] saved: $${payload.raised} / $${payload.goal} (${payload.donors} donors, ${payload.percent}%)`,
		);
	} catch (err) {
		console.error("[scraper] error:", err);
	}
}

function parse(html: string): Omit<CampaignData, "source" | "updatedAt"> | null {
	const jsonRaised = matchNumber(html, /"current_amount"\s*:\s*(\d+(?:\.\d+)?)/);
	const jsonGoal = matchNumber(html, /"goal_amount"\s*:\s*(\d+(?:\.\d+)?)/);
	const jsonDonors = matchNumber(html, /"donation_count"\s*:\s*(\d+)/);
	if (jsonRaised !== null) {
		const raised = normalizeAmount(jsonRaised);
		const goal = jsonGoal !== null ? normalizeAmount(jsonGoal) : 0;
		return {
			raised,
			goal,
			donors: jsonDonors !== null ? Math.round(jsonDonors) : 0,
			percent: goal > 0 ? Math.round((raised / goal) * 100) : 0,
		};
	}
	const textRaised = matchNumber(html, /\$\s*([0-9][0-9,]*)\s*raised/i);
	if (textRaised !== null) {
		return {
			raised: Math.round(textRaised),
			goal: 0,
			donors: 0,
			percent: 0,
		};
	}
	return null;
}

function matchNumber(html: string, re: RegExp): number | null {
	const m = html.match(re);
	if (!m) return null;
	const n = parseFloat(m[1].replace(/,/g, ""));
	return Number.isFinite(n) ? n : null;
}

function normalizeAmount(n: number): number {
	if (n > 1_000_000) {
		return Math.round(n / 100);
	}
	return Math.round(n);
}

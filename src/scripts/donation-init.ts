import "./reveal.ts";

const section = document.querySelector<HTMLElement>(".donation");
if (section) {
	const apiUrl = section.getAttribute("data-gofundme-api");
	const meta = section.querySelector(".meta");
	const amount = meta ? meta.querySelector(".meta-amount") : null;
	const fill = meta ? meta.querySelector<HTMLElement>(".meta-fill") : null;
	const bar = meta ? meta.querySelector('[role="progressbar"]') : null;

	if (apiUrl && meta && amount && fill && bar) {
		fetch(apiUrl, { method: "GET" })
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (!data) return;
				if (typeof data.raised !== "number") return;
				if (typeof data.goal !== "number" || data.goal <= 0) return;
				const raised = Math.round(data.raised);
				const goal = Math.round(data.goal);
				const raisedFmt = new Intl.NumberFormat("en-US").format(raised);
				const goalFmt = new Intl.NumberFormat("en-US").format(goal);
				amount.innerHTML = `$${raisedFmt} <span class="meta-amount-sep">/</span> $${goalFmt}`;
				const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));
				fill.style.width = `${pct}%`;
				bar.setAttribute("aria-valuenow", String(pct));
				bar.setAttribute(
					"aria-label",
					`Progreso de la campaña: ${raisedFmt} dólares recaudados de ${goalFmt}`,
				);
				if (typeof data.donors === "number") {
					meta.setAttribute(
						"aria-label",
						`Progreso de la campaña: ${raisedFmt} dólares recaudados de ${goalFmt} con ${data.donors} donantes`,
					);
				}
			})
			.catch(() => {
				/* silent fail — SSR fallback */
			});
	}
}

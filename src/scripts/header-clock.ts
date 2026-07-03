export {};

const root = document.querySelector<HTMLElement>(".hd-clock");
if (root) {
	const target = new Date(root.dataset.target || "").getTime();
	const fields = {
		d: root.querySelector<HTMLElement>('[data-field="d"]'),
		h: root.querySelector<HTMLElement>('[data-field="h"]'),
		m: root.querySelector<HTMLElement>('[data-field="m"]'),
		s: root.querySelector<HTMLElement>('[data-field="s"]'),
	};
	const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");
	const tick = () => {
		const diff = Math.max(0, target - Date.now());
		const total = Math.floor(diff / 1000);
		const d = Math.floor(total / 86400);
		const h = Math.floor((total % 86400) / 3600);
		const m = Math.floor((total % 3600) / 60);
		const s = total % 60;
		if (fields.d) fields.d.textContent = pad(d);
		if (fields.h) fields.h.textContent = pad(h);
		if (fields.m) fields.m.textContent = pad(m);
		if (fields.s) fields.s.textContent = pad(s);
	};
	tick();
	setInterval(tick, 1000);
}

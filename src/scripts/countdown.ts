export {};

const root = document.querySelector<HTMLElement>(".cd-clock");
if (root) {
	const target = new Date(root.dataset.target || "").getTime();
	const fields = {
		d: root.querySelector<HTMLElement>('[data-field="d"]'),
		h: root.querySelector<HTMLElement>('[data-field="h"]'),
		m: root.querySelector<HTMLElement>('[data-field="m"]'),
	};
	const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");
	const tick = () => {
		const diff = Math.max(0, target - Date.now());
		const total = Math.floor(diff / 1000);
		if (fields.d) fields.d.textContent = pad(Math.floor(total / 86400));
		if (fields.h) fields.h.textContent = pad(Math.floor((total % 86400) / 3600));
		if (fields.m) fields.m.textContent = pad(Math.floor((total % 3600) / 60));
	};
	tick();
	setInterval(tick, 1000);
}

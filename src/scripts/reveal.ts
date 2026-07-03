const targets = document.querySelectorAll<HTMLElement>(".reveal");
if (targets.length) {
	if ("IntersectionObserver" in window) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 },
		);
		targets.forEach((t) => io.observe(t));
	} else {
		targets.forEach((t) => t.classList.add("is-visible"));
	}
}

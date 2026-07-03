# AGENTS.md

Instrucciones para cualquier agente de IA que trabaje en este repo.

## Project overview

Landing one-page de alto impacto para el **ENC Clasificatorio — Street Fighter 6** (duelo final por el último puesto del equipo Venezuela para la Esports Nations Cup). Estética *Main Event* (UFC/WWE × La Velada del Año × UI de Fighting Games): negro profundo + neón, tipografía pesada, barra de versus.

**Importante — framing de donaciones:** la campaña de GoFundMe es **100% humanitaria**, para los afectados del **doble terremoto del 24/06/2026** en Caracas y La Guaira (M7.2 + M7.5, eje San Felipe–Yumare–Montalbán, +2,000 víctimas fatales, +10,500 heridos, 7 estados afectados, La Guaira "zona cero"). El evento SF6 es el **gancho de awareness**; los fondos NO son para logística deportiva. Mantén ese tono en cualquier copy o CTA de donación.

La **fuente de verdad del maquetado** es `STITCH_PROMPT.md` (prompt para Stitch/MiniMax M3). Consúltalo antes de tocar componentes o estilos.

## Tech stack & setup

- **Runtime:** Node `>=22.12.0` (ver `package.json`).
- **Framework:** Astro 7 (`astro@^7.0.6`), sin framework UI adicional.
- **Estilos:** Tailwind CSS **v4** vía `@tailwindcss/vite` (config por CSS con `@theme` en `src/styles/global.css`, **sin** `tailwind.config.js`).
- **Imágenes:** `astro:assets` (`<Image>`) para contenido optimizado.
- **Backend:** [Supabase](https://supabase.com) (Postgres + Auth + Realtime) para persistencia de votos y OAuth Google/Twitch. Cliente: `@supabase/supabase-js`. **No requiere SSR** — el sitio sigue siendo `output: 'static'`.
- **Idioma:** Español (VE) salvo marcas (SF6, ENC, GoFundMe, Twitch).

Setup inicial (si `node_modules` no está instalado o Tailwind falta):
```sh
npm install
npm i tailwindcss @tailwindcss/vite @supabase/supabase-js
```

`astro.config.mjs` debe registrar el plugin de Tailwind:
```js
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ vite: { plugins: [tailwindcss()] } });
```

`astro.config.mjs` sigue sin adapter — el deploy es estático. La auth y los datos se hacen client-side con `@supabase/supabase-js` cargado en el browser.

## Commands

```sh
npm run dev        # dev server (usar --background en agentes, ver abajo)
npm run build      # build producción -> ./dist/
npm run preview    # preview del build
npx astro check    # TYPECHECK (typecheck obligatorio antes de commit)
```

No hay linter configurado todavía. Si añades lint, documenta el comando aquí.

## Backend (Supabase)

El proyecto usa Supabase para persistir votos. Las variables `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` deben estar en `.env` (ver `.env.example`).

**Comportamiento graceful**: si Supabase no está configurado, el sitio renderiza normal con mensajes informativos en la sección de predicción:
- AuthBar: "Supabase no está configurado. Crea un archivo `.env` con..."
- PredictionBar: oculta los botones de voto y muestra "Las votaciones están deshabilitadas. Configura Supabase para habilitarlas."
- Feed: "Cuando alguien vote, aparecerá aquí."

Esto permite desarrollar el sitio sin necesidad de tener Supabase configurado localmente.

**Schema requerido en Supabase** (SQL Editor):
```sql
create extension if not exists pgcrypto;

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  tag text not null check (char_length(tag) between 2 and 32),
  side text not null check (side in ('p1', 'p2')),
  amount integer not null check (amount between 1 and 10000),
  voter_name text,
  voter_avatar text,
  created_at timestamptz not null default now()
);

create index votes_created_idx on public.votes (created_at desc);
create index votes_side_idx on public.votes (side);
create unique index votes_one_per_user on public.votes (user_id)
  where user_id is not null;

alter publication supabase_realtime add table public.votes;

alter table public.votes enable row level security;

create policy "votes_public_read" on public.votes for select using (true);
create policy "votes_insert_authenticated" on public.votes for insert
  with check (auth.uid() = user_id);
```

**Auth providers requeridos** (Supabase Dashboard → Authentication → Providers):
- Google (con OAuth client ID y secret de Google Cloud Console)
- X (Twitter) (con OAuth 2.0 client ID y secret de [developer.x.com](https://developer.x.com))

**Redirect URLs** (Settings → Authentication → URL Configuration):
- Site URL: dominio final (ej. `https://enc-gambling.vercel.app`)
- Redirect URLs: agregar `https://<dominio>/**`

## Project structure

```
src/
├── styles/global.css          @theme tokens + @layer base + keyframes
├── data/event.ts              datos mock del evento (ver "Placeholders")
├── env.d.ts                   tipos de import.meta.env (PUBLIC_SUPABASE_*)
├── lib/                       helpers client-side
│   ├── supabase.ts            cliente Supabase único (con fallback graceful)
│   ├── auth.ts                signInWith / signOut / getDisplayName / getAvatarUrl
│   └── votes.ts               fetchRecentVotes / countVotes / fetchMyVote / insertVote / subscribeVotes
├── layouts/Layout.astro       <html lang="es">, fonts, meta OG, slot
├── components/
│   ├── BackgroundFX.astro
│   ├── StickyHeader.astro
│   ├── HeroVS.astro
│   ├── FighterCard.astro
│   ├── AuthBar.astro          pills Google/Twitch + estado de sesión
│   ├── PredictionBar.astro    3 estados (pick/form/done) con Supabase
│   ├── CountdownBig.astro
│   ├── Footer.astro
│   ├── DonationCard.astro
│   └── EventDetails.astro
└── pages/index.astro          compone las secciones en orden

workers/
└── gofundme-scraper/          Cloudflare Worker que scrapea GoFundMe (cron + KV)
    ├── src/index.ts
    ├── wrangler.toml
    ├── package.json
    ├── tsconfig.json
    └── README.md

public/
├── chars/                     assets de chars optimizados (deejay.webp, zangief.webp)
├── placeholders/avatar.svg    placeholder de avatar de jugador
└── _headers                   Cloudflare Pages: cache + security headers (CSP, HSTS, etc.)
```

DEPLOY.md                       paso a paso para desplegar en Cloudflare Pages + Worker
```

## Assets / imágenes

- **Personajes de SF6** → `public/chars/` (`.webp` optimizado, servidos como URL estática).
  - Usados tanto en SSR (FighterCard) como client-side (PredictionBar feed) — por eso están en `public/` y no en `src/assets/`.
  - Cuando se reemplace un char real (ej. `ken.webp`), **solo se cambia el archivo en `public/chars/`**. El nombre se referencia desde `event.ts` (`P1.charImg`, `P2.charImg`).
- **Avatares de jugadores** (placeholders de personas) → `public/placeholders/avatar.svg`, referencedos por URL `/placeholders/avatar.svg` con `<img>`.
- **Fuentes:** `Anton` / `Archivo Black` (display) + `Inter` (cuerpo), vía Google Fonts con `preconnect` en el `<head>` del Layout.

## Design system (resumen)

Tokens completos en `src/styles/global.css` (`@theme`). Reglas no negociables:

- **Dualidad cromática:** Player 1 siempre `cyan` (`#19e3ff`); Player 2 siempre `flame` (`#ff5b1f`). El "VS" usa gradiente cyan→flame.
- Fondo `void` (`#05050a`) + scanlines + radial `electric` sutil.
- Tipografía display `Anton`, mayúsculas, tracking apretado. `VS` gigante con `skew(-6deg)` y glow.
- **Accesibilidad:** contraste AA, `focus-visible` en todos los CTAs, `aria-label` en botones que abren externas (GoFundMe, Twitch).
- **`prefers-reduced-motion`:** deshabilitar `vs-throb`, `neon-flicker`, `hit-flash`, `pulse-blood`, `quake`. Revelar secciones sin transform. Siempre respetado.

Detalle visual por componente, keyframes y copy: ver `STITCH_PROMPT.md` (§6, §7, §8).

## Placeholders por reemplazar

Centralizados en `src/data/event.ts`. Todos deben quedar como **strings literales visibles** para find/replace posterior:

| Placeholder | Dónde | Qué es |
|---|---|---|
| `{{GOFUNDME_URL}}` | `EVENT.gofundme` | Reemplazado: `https://www.gofundme.com/f/venezuela-fg-community-earthquake-relief` |
| `{{TWITCH_CHANNEL}}` | `EVENT.twitchChannel` | Canal de Twitch para el embed |
| `{{HOST}}` | `EVENT.host` | Dominio para `parent` del iframe de Twitch |
| `{{EVENT_DATE_ISO}}` | `EVENT.dateISO` | Fecha/hora ISO del evento (countdown) |
| `{{PLAYER_1}}` / `{{PLAYER_2}}` | `P1.name` / `P2.name` | Nombres reales |
| `{{PLAYER_1_GT}}` / `{{PLAYER_2_GT}}` | `P1.gt` / `P2.gt` | Gamertags |
| `{{CHAR_P1}}` / `{{CHAR_P2}}` | `P1.char` / `P2.char` | Mains de SF6 |

## Content rules

## Backend (GoFundMe — montos en vivo, opcional)

Adicional a Supabase, hay un **Cloudflare Worker opcional** en `workers/gofundme-scraper/` que scrapea el monto de la campaña cada 30 min y lo expone como JSON público:

- Endpoint: `GET /api/gofundme` → `{ raised, goal, percent, donors, source, updatedAt }`
- CORS abierto (`*`), cache 60s
- Requiere deploy manual con Wrangler (instrucciones en `workers/gofundme-scraper/README.md`)
- Variable opcional en `.env`: `PUBLIC_GOFUNDME_API_URL` (si está vacía, la landing usa solo el hardcode fallback de `event.ts`)

**⚠️ Riesgo legal:** los GoFundMe TOS §12.3 (Effective June 23, 2026) prohíben scraping automatizado de Services Content. Proceder bajo propia responsabilidad. Documentado en el README del worker.

## Backend (Supabase)
- **Donaciones = ayuda humanitaria por el terremoto.** Nunca "logística/viaje del clasificado". El ángulo es **FGC comunitario** (TOs, Smash Vargas, Tekken) — NO victimizar con cifras de daños, la audiencia ya conoce la tragedia.
- Footer con disclaimer: "Hecho con 🇻🇪 para la comunidad FGC. ENC Clasificatorio — no oficial afiliado a Capcom."
- Cero comentarios en código salvo `// TODO:` para los placeholders.

## Definition of done (antes de commit)

1. `npx astro check` pasa sin errores.
2. `npm run build` pasa sin errores.
3. Dualidad cromática P1/P2 consistente en toda la página.
4. `prefers-reduced-motion` respetado.
5. Responsive correcto en 375 / 768 / 1280 px.
6. Placeholders `{{...}}` intactos (sin reemplazar a medias).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

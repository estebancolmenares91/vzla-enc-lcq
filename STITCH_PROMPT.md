# 🥊 PROMPT STITCH · ENC Clasificatorio — Street Fighter 6 Main Event Landing

> Prompt técnico ultra-detallado para ser ejecutado por **MiniMax M3** vía **Stitch**.
> Output esperado: código Astro 7 + Tailwind v4 listo para build.

---

## 0. META-INSTRUCCIONES PARA MINIMAX M3

- Eres un **Frontend Architect + Visual Designer** especializado en landings de esports con estética *Main Event* (UFC/WWE × La Velada del Año × UI de Fighting Games).
- Tu output debe ser **código Astro 7 + Tailwind CSS v4 + TypeScript light**, listo para build.
- Prioriza la **jerarquía visual y el impacto**: tipografía pesada, alto contraste, neón sobre negro profundo, profundidad dramática.
- Sé **sumamente descriptivo** con cada micro-interacción, animación y estado visual. Expresa tu capacidad de diseño en cada componente.
- Nada de código placeholder vago: cada componente completamente implementado y estilizado.
- Mantén **accesibilidad básica** (contraste AA en texto, `focus-visible`, `aria-labels` en CTAs).
- Idioma del copy: **Español (VE)** salvo términos trademark (SF6, ENC, GoFundMe, Twitch).

---

## 1. OBJETIVO DEL PRODUCTO

Landing one-page de alto impacto para el evento de Esports: **Duelo Final por el último puesto del equipo Venezuela para la Esports Nations Cup (ENC)** en Street Fighter 6. La página debe sentirse como un *Main Event* de combate: agresiva, competitiva, barra de versus, neón nocturno y CTA fuertes para (a) votar al favorito de la comunidad y (b) **donar a los afectados del doble terremoto del 24/06/2026 en Caracas y La Guaira**. El evento deportivo funciona como **gancho de awareness**; la recolección de fondos es **100% humanitaria** y destino de la campaña.

---

## 2. STACK TECNOLÓGICO

- **Framework base:** Astro 7 (proyecto ya inicializado, `astro@^7.0.6`).
- **Estilos:** Tailwind CSS **v4** vía `@tailwindcss/vite` (config por CSS con `@theme`, sin `tailwind.config.js`).
- **Componentes interactivos:** Astro components + **vanilla TS en islas `<script>`** (sin framework UI adicional; bundle mínimo).
- **Iconografía:** SVG inline (bandera VE, iconos donación, reloj countdown, logo ENC).
- **Tipografía:** Google Fonts `Anton` / `Archivo Black` (impacto) + `Inter` (cuerpo), cargadas en `<head>`.
- **Animaciones:** Tailwind utilities + `@keyframes` propios + `IntersectionObserver` para reveals.
- **Sin backend.** Todos los datos (jugadores, % de votos, countdown) son **datos estáticos mock** con animación en cliente.

### 2.1 Setup Tailwind v4 (instrucciones de ejecución)

```sh
npm i tailwindcss @tailwindcss/vite
```

`astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

`src/styles/global.css` (importado por el Layout):
```css
@import "tailwindcss";

@theme {
  --color-void: #05050a;
  --color-void-2: #0c0c14;
  --color-steel: #15151f;
  --color-ink: #1f1f2b;
  --color-flame: #ff5b1f;
  --color-flame-glow: #ff8a3d;
  --color-blood: #e11d2a;
  --color-cyan: #19e3ff;
  --color-electric: #7c5cff;
  --color-gold: #ffce4d;
  --color-bone: #f5f5f0;
  --color-ash: #9aa0ad;

  --font-display: "Anton", "Archivo Black", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```

---

## 3. PALETA DE COLORES (Design Tokens)

Estética: arena de combate nocturna — negro profundo, neón agresivo, dualidad cromática para el Versus.

| Token | Hex | Uso |
|---|---|---|
| `--color-void` | `#05050a` | Fondo base, casi negro puro |
| `--color-void-2` | `#0c0c14` | Secciones alternas, gradiente |
| `--color-steel` | `#15151f` | Cards, paneles, bordes soft |
| `--color-ink` | `#1f1f2b` | Bordes sutiles sobre void |
| `--color-flame` | `#ff5b1f` | Neón naranja — Player 2 / CTA primario |
| `--color-flame-glow` | `#ff8a3d` | Glow, hover, halos |
| `--color-blood` | `#e11d2a` | Rojo arcade — "FIGHT", danger |
| `--color-cyan` | `#19e3ff` | Neón cyan — Player 1 / acentos fríos |
| `--color-electric` | `#7c5cff` | Magenta/violeta — ENC brand |
| `--color-gold` | `#ffce4d` | Countdown, premios, "clasificado" |
| `--color-bone` | `#f5f5f0` | Texto claro sobre oscuro |
| `--color-ash` | `#9aa0ad` | Texto secundario |

- **Gradiente global:** `radial-gradient` sutil desde `electric` muy oscuro al centro hacia `void` en bordes.
- **Textura de fondo:** patrón SVG de *scanlines* (opacidad 4%) para evocar CRT de arcade.
- **Outer glow estándar:** `box-shadow: 0 0 40px <neon>/35` en elementos clave.
- **Dualidad cromática obligatoria:** Player 1 vive en `cyan`, Player 2 vive en `flame`. El "VS" central usa ambos en gradiente diagonal.

---

## 4. TIPOGRAFÍA Y ESCALA

- **Display / Impacto:** `Anton` — mayúsculas, tracking apretado (`-0.02em`), peso siempre 900.
- **Versus "VS":** `clamp(8rem, 22vw, 18rem)`, fill transparente con `stroke` neón, `skew(-6deg)`, dual drop-shadow.
- **Cuerpo:** `Inter` 400/500/600. Base 16px, escala modular 1.25.
- **Captions / metadata de combate:** uppercase, `letter-spacing: 0.15em`, color `ash`.
- **Title hierarchy:** H1 hero > 6rem; H2 sección `clamp(2.5rem,5vw,4rem)` con una palabra a color (`flame` o `cyan`) para dualidad.

---

## 5. ESTRUCTURA DE COMPONENTES

```
src/
├── styles/global.css               @theme tokens + @layer base + keyframes
├── layouts/
│   └── Layout.astro                <html lang="es">, fonts, meta OG, slot, footer fijo
├── components/
│   ├── BackgroundFX.astro          scanlines + radial gradients + grid floor
│   ├── StickyHeader.astro          logo ENC + Countdown mini + CTA "Apoya"
│   ├── HeroVS.astro                👑 SECCIÓN 1 — Versus gigante
│   ├── FighterCard.astro           sub-componente (avatar/nombre/char/flag)
│   ├── PredictionBar.astro         👑 SECCIÓN 2 — Barras de vida / votos
│   ├── DonationCard.astro          👑 SECCIÓN 3 — Apoyo y donaciones
│   └── EventDetails.astro          👑 SECCIÓN 4 — Countdown + Twitch embed
└── pages/index.astro                <Layout> compone las 4 secciones en orden
```

### 5.1 Mantener consistencia con el proyecto actual

Stitch debe empaquetar/editar estos archivos **existentes**:
- `src/layouts/Layout.astro` — ampliar `<head>` con fonts, meta OG (`og:title="ENC Clasificatorio — Duelo Final Venezuela"`), `lang="es"`. Conservar el `<slot/>`. Reemplazar el `<style>` inline por `import "../styles/global.css"`.
- `src/pages/index.astro` — sustituir `<Welcome />` por la composición de las 4 secciones en orden.
- `astro.config.mjs` — añadir el plugin de Tailwind v4 (ver 2.1).
- `src/components/Welcome.astro` — puede eliminarse o renombrarse; no se usa en la landing final.

---

## 6. ESPECIFICACIÓN POR COMPONENTE

### 6.1 `BackgroundFX.astro`
Fijo (`position: fixed; inset: 0; z-index: -10`), detrás de todo.
- Capa 1: `radial-gradient(circle at 50% 0%, rgba(124,92,255,0.18), transparent 55%)`.
- Capa 2: scanlines SVG (`repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.04) 2px 3px)`).
- Capa 3: "grid floor" en perspectiva al fondo inferior (lines cyan/flame con `opacity 0.12`, `perspective` + `rotateX(70deg)`).
- Sin interacción. Decorativo puro.

### 6.2 `StickyHeader.astro`
`position: sticky; top: 0; backdrop-blur-md; bg-void/70; border-b border-ink`.
- Izquierda: logo ENC (texto `font-display`, `text-electric`, glow).
- Centro: mini-countdown inline (`<CountdownMini />`) en `text-gold`, formato `DD HH MM SS`.
- Derecha: CTA pill "Apoya al clasificado" → ancla a `#donar`.
- Comportamiento: al hacer scroll > 80vh, aparece una franja roja `blood` de 2px en el borde inferior con `keyframe pulse`.

### 6.3 `HeroVS.astro` — SECCIÓN 1: MAIN EVENT
Altura `min-h-screen`, contenido centrado verticalmente.

**Layout (3 columnas asimétricas):**
```
[ FighterCard P1 ]   [   V S   ]   [ FighterCard P2 ]
   cyan side             center        flame side
```

- **FighterCard P1** (usa `FighterCard.astro` con `side="left"` y `accent="cyan"`):
  - Avatar circular/grande (`w-72 h-72`) con `ring-4 ring-cyan` y `drop-shadow-[0_0_45px_rgba(25,227,255,0.6)]`.
  - Bandera de Venezuela (SVG inline) junto al nombre.
  - Nombre display `text-5xl font-display uppercase`.
  - Gamertag `{{PLAYER_1_GT}}` en `text-ash`.
  - Main character SF6: chip `"MAIN: {{CHAR_P1}}"` con icono.
  - Pequeño win-rate mock `"RÉCORD 23-4"` en caption.
  - Reflejo en espejo del avatar bajo él (CSS `scaleY(-1)`, `mask-image` gradiente a transparent).
- **"VS" central:**
  - `font-display`, `clamp(8rem, 22vw, 18rem)`, `skew(-6deg)`, `letter-spacing: -0.04em`.
  - `background: linear-gradient(135deg, var(--cyan), var(--flame))` con `background-clip: text; color: transparent`.
  - `filter: drop-shadow(0 0 30px rgba(255,91,31,0.5)) drop-shadow(0 0 30px rgba(25,227,255,0.5))`.
  - Animación `vs-throb` (scale 1 → 1.04 → 1, 2.4s ease-in-out infinite).
  - Dos "slash" diagonales decorativos (SVG) cruzando el VS, opacidad baja.
- **Encima del VS (top, pequeño):** sin eyebrow decorativo — el hero arranca directo con el título.
- **Encima del VS (sin eyebrow):** título principal `font-display uppercase` en dos palabras jerarquizadas, composición vertical con `flex-direction: column` y `gap: 0.05em`. "UNA" en `text-ash` con `clamp(1.5rem, 2.4vw, 2rem)` y tracking ancho (0.55em) como soporte. "MÁS" en `text-bone` con `clamp(5.5rem, 13vw, 11rem)`, `line-height: 1` y `letter-spacing: -0.05em` como golpe visual. Sin sombras, sin gradientes — la fuerza viene del tamaño y el contraste. `line-height: 1` en el "MÁS" es crítico para que el acento del "Á" no se corte. El `gap: 0.05em` en lugar de `margin-bottom` negativo evita que "UNA" se superponga dentro de "MÁS".
- **Footer del hero:** dos CTAs pillados:
  - Primario `bg-flame text-void hover:bg-flame-glow` → "Pronostica al ganador" (#vota).
  - Secundario outline `border border-cyan text-cyan hover:bg-cyan/10` → "Apoya la campaña" (#donar).
- **Micro-interacción hero:** al hover sobre FighterCard P1, el VS se inclina `-2deg` y crece `scale(1.03)` con `transition-transform 400ms ease-out` (efecto "empuje"). Hover P2 = `+2deg`. Simétrico.

### 6.4 `PredictionBar.astro` — SECCIÓN 2: PRONÓSTICOS
Título sección: "¿QUIÉN SE LLEVA EL PUESTO?" con "PUESTO" en gradiente cyan→flame.

**Componentes en orden (top→bottom):**
1. `AuthBar.astro` — pills "Inicia sesión con Google / Twitch" o avatar+signout si hay sesión
2. `lifebar` — barra de vida SF6 con P1 cyan vs P2 flame, `data-p1="{{PCT_P1}}%"` `data-p2="{{PCT_P2}}%"`, ticks diagonales, VS central
3. `pred-figures` — avatares placeholder + GT + porcentaje grande (display) por jugador
4. `pred-ticker` — "LA COMUNIDAD DICE: {{LEADER}} LLEVA LA VENTAJA" (cambia según %)
5. `pred-feed` — lista "Últimos votos de la comunidad" con hasta 8 items, cada uno: char thumbnail, tag del votador, "apoyó a {{GT}}", monto $X, tiempo relativo. Renderizado client-side desde Supabase
6. `pred-stage data-stage="pick"` — dos botones con chars SF6: "⚡ APOYO A {{PLAYER_1_GT}}" / "🔥 APOYO A {{PLAYER_2_GT}}"
7. `pred-stage data-stage="form" hidden` — formulario de confirmación (ver flujo abajo)
8. `pred-stage data-stage="done" hidden` — confirmación con CTA a GoFundMe

**Flujo de interacción (OAuth obligatorio, Supabase Realtime):**
- Click en `APOYO A P1` o `APOYO A P2`:
  - Si NO hay sesión: dispara `signInWith('google')` y Supabase redirige a OAuth. Al volver, `onAuthStateChange` rehidrata la sesión y `fetchMyVote` chequea si ya votó.
  - Si hay sesión: abre `pred-stage form` con `data-side="p1"` o `"p2"`. Color de los inputs/chips/botón cambia a cyan o flame según el lado seleccionado via CSS custom property `--pred-accent`.
- Form tiene:
  - Input "Tu tag o gamertag" pre-llenado con `getDisplayName(user)` (auto-fill desde OAuth, editable)
  - Chips `$5 / $10 / $25 / $50` + input custom
  - Botón "Confirmar voto" → llama `insertVote({ tag, side, amount }, user)` que hace `supabase.from('votes').insert(...)`. El `unique index votes_one_per_user` previene doble voto
- Al confirmar: lifebar se actualiza, flash en la barra del oponente, avanza a `pred-stage done` con tag + monto + CTA a `EVENT.gofundme`
- `pred-done` muestra: check icon + "YA PRONOSTICASTE" + "Apoyas a {{GT}} con $X" + "como {{tag}}" + "Completar aporte en GoFundMe" (link externo a `EVENT.gofundme` en nueva pestaña)

**Real-time updates:**
- `subscribeVotes()` crea `supabase.channel('votes-stream').on('postgres_changes', { event: 'INSERT' })`
- En cada insert remoto: preprende al feed, incrementa el contador `VOTE_TOTAL`
- Si el voto entrante es del propio usuario, refresca el estado `done`

**Comportamiento sin Supabase configurado (graceful):**
- `SUPABASE_ENABLED = false` si faltan `PUBLIC_SUPABASE_URL` o `PUBLIC_SUPABASE_ANON_KEY`
- AuthBar muestra mensaje de error con instrucciones para crear `.env`
- PredictionBar oculta los botones de voto y muestra "Las votaciones están deshabilitadas. Configura Supabase para habilitarlas."
- Feed muestra "Cuando alguien vote, aparecerá aquí."

**Tokens de color del form (cambian por lado):**
- P1: `--pred-accent: var(--color-cyan)` (border-top, focus borders, chip activo, submit button)
- P2: `--pred-accent: var(--color-flame)`
- Implementado con selectores `.pred-stage--form[data-side="p1"]` y `[data-side="p2"]`

### 6.5 `DonationCard.astro` — SECCIÓN 3: APOYO Y DONACIONES (TERREMOTO)

> **Contexto humanitario obligatorio:** el doble terremoto del 24/06/2026 (M7.2 + M7.5, eje San Felipe–Yumare–Montalbán) dejó **+2,000 víctimas fatales y +10,500 heridos**, afectó 7 estados y declaró **La Guaira "zona cero"** por colapso de infraestructuras. La Guaira y Caracas son el foco. El CTA debe transmitir **urgencia, gravedad y solidaridad**, sin perder la fuerza visual de la landing.

Fondo `bg-void-2`, `border border-blood/40`, glow rojo-sangre suave (`box-shadow: 0 0 50px rgba(225,29,42,0.25)`). Esta sección **rompe levemente** el tono arcade para tornarse **solemne pero movilizadora**.

**Layout:**

- Eyebrow `text-gold tracking-[0.3em] uppercase` → "🇻🇪 VENEZUEBA NECESITA AYUDA · 24/06/2026".
- Título `text-5xl font-display uppercase` → "POR CARACAS Y LA GUAIRA" con "GUAIRA" en `text-blood` y un temblor sutil (`keyframe quake` 1s, ver 8.1).
- Subtítulo `text-ash text-lg max-w-2xl` → "El ring se pausa. Venezuela vive una tragedia sin precedentes. Cada aporte llega a quienes más lo necesitan."
- **Bloque de datos de la tragedia** (3 mini-cards en grid `grid-cols-3 gap-3`):
  - Card 1: número `text-4xl font-display text-blood` → "+2,000", label `text-ash text-xs uppercase` → "Víctimas fatales".
  - Card 2: `+10,500` → "Heridos".
  - Card 3: `7 estados` → "Estados afectados".
  - Bordes `border border-ink rounded-lg p-3 bg-steel`, separadores finos.
- **Línea de contexto** (`text-ash text-sm`): "Sismos M7.2 y M7.5 · Zona cero: La Guaira · Caracas, Miranda, Carabobo, Yaracuy y Falcón con daños severos · Estado de emergencia y alerta roja activos."
- Cuerpo de copy de apoyo (2-3 frases, ver sección 7).
- **Selector de monto (quick-select chips):** `$5 · $10 · $25 · $50 · Custom`.
  - Chips `border border-ink rounded-full px-5 py-2 hover:border-gold hover:bg-gold/10`.
  - Chip activo: `bg-gold text-void border-gold` + glow gold.
  - "Custom" revela `<input type="number">` con prefix `$` y `border-b-2 border-gold`.
- **Meta visual:** barra "META DE AYUDA: ${{GOAL}}" con `{{RAISED}}` relleno en gradiente `gold → flame`. Tick marks cada 25%. Microcopy bajo la barra: "Fondo destinado a víveres, medicina, rescate y refugio en zona cero."
- **CTA principal:** botón full-width `h-14 bg-gold text-void font-display text-xl hover:brightness-110 active:scale-[0.98]` → "DONAR AHORA EN GOFUNDME →".
  - `href="{{GOFUNDME_URL}}"`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label="Donar en GoFundMe para los afectados del terremoto (abre en nueva pestaña)"`.
- Debajo del CTA: badge de confianza `"Pago seguro vía GoFundMe · 100% para ayuda humanitaria"` con icono candado SVG.
- **Micro-interacción:** al seleccionar un monto, el glow del card pasa a gold (`box-shadow: 0 0 60px rgba(255,206,77,0.5)`). Hover sobre el CTA: `translateY(-2px)` + brillo, **sin skew** (mantener seriedad).
- **Cierre de sección:** línea pequeña centrada `text-ash text-xs tracking-widest uppercase` → "Los combatientes del ENC dedican este duelo a Venezuela. 🇻🇪"

### 6.6 `EventDetails.astro` — SECCIÓN 4: DETALLES Y TRANSMISIÓN
Grid 2 columnas en desktop, stack en mobile.

**Columna izquierda — Countdown:**
- Eyebrow `text-gold tracking-[0.3em]` → "CUENTA REGRESIVA".
- Reloj grande: 4 bloques (`DÍAS / HORAS / MIN / SEG`) cada uno `bg-steel border border-ink rounded-lg p-4`, número `font-display text-6xl text-bone`, label `text-ash text-xs uppercase tracking-widest`.
- Separadores `:` con `text-gold` parpadeando (`keyframe blink 1s steps(2) infinite`).
- Lógica: target date `{{EVENT_DATE_ISO}}`; al llegar a 0, mostrar overlay `"¡EN VIVO AHORA!"` con `bg-blood` y pulsación.
- Debajo: línea de metadata `"📅 {{EVENT_DATE}} · 🕐 {{EVENT_TIME}} VET"` + `"📍 Online · Transmisión oficial"`.

**Columna derecha — Twitch embed:**
- `iframe` Twitch parent embedded: `https://player.twitch.tv/?channel={{TWITCH_CHANNEL}}&parent={{HOST}}&autoplay=false&mute=true`.
- Wrapper `aspect-video rounded-lg border-2 border-electric/40 overflow-hidden shadow-[0_0_50px_rgba(124,92,255,0.35)]`.
- Encima del iframe (overlay cuando no está en vivo): placeholder con logo ENC, copy `"EL RING SE ENCIENDE {{EVENT_DATE}}"`, y botón "Set reminder" (decorativo, link a `#`).
- Banner superior del embed: `"🔴 EN VIVO"` (oculto hasta que countdown = 0, controlado por una clase `is-live`).
- Debajo: chips sociales `"Síguenos @enc_ve"`, `"#EncClasificatorio"`.

---

## 7. COPY DEL EVENTO

Microcopy sugerido (puede ajustarse). Tono: épico, directo, orgulloso de Venezuela.

- **Hero eyebrow:** (eliminado — el hero arranca directo con el título `UNA MÁS`)
- **Hero title:** `UNA MÁS` (jerarquizado: "UNA" pequeño + ash, "MÁS" gigante + bone, sin dualidad cromática)
- **Hero subtitle:** `Dos luchadores. Una nación. El boleto a la Esports Nations Cup.`
- **Hero CTA1:** `Pronostica al ganador`
- **Hero CTA2:** `Apoya la campaña`
- **Prediction title:** `¿QUIÉN SE LLEVA EL PUESTO?`
- **Prediction sub:** `Tu voto cuenta. La comunidad decide quién entra favorito al ring.`
- **Donation eyebrow:** `VENEZUELA NECESITA AYUDA · 24/06/2026`
- **Donation title:** `POR CARACAS Y LA GUAIRA`
- **Donation sub:** `El ring se pausa. Venezuela vive una tragedia sin precedentes. Cada aporte llega a quienes más lo necesitan.`
- **Donation body:** `El doble terremoto del 24 de junio sacudió Caracas, La Guaira y cinco estados más, dejando miles de víctimas y zona cero en infraestructura. Desde el ENC Clasificatorio abrimos este canal para que la comunidad FGC y todo el que vea el duelo se sume a la emergencia. Víveres, medicina, rescate y refugio: cada peso es un golpe por Venezuela.`
- **Donation CTA:** `DONAR AHORA EN GOFUNDME`
- **Donation footer line:** `Los combatientes del ENC dedican este duelo a Venezuela. 🇻🇪`
- **Event eyebrow:** `CUENTA REGRESIVA`
- **Event title:** `EL RING SE ENCIENDE`
- **Event sub:** `Transmisión oficial por Twitch. Llega temprano, que no te cuenten el KO.`
- **Footer:** `Hecho con 🇻🇪 para la comunidad FGC. ENC Clasificatorio — no oficial afiliado a Capcom.`

---

## 8. MICRO-INTERACCIONES Y ANIMACIONES

### 8.1 Keyframes a definir en `global.css`

- `vs-throb`: `0%,100% { transform: skew(-6deg) scale(1) } 50% { transform: skew(-6deg) scale(1.04) }` — 2.4s infinite.
- `neon-flicker`: opacidad `1 → 0.85 → 1 → 0.9 → 1` en 3s, evoca neón real.
- `bar-fill`: width transition `600ms cubic-bezier(.2,.8,.2,1)`.
- `hit-flash`: `0% { background: rgba(255,255,255,0.8) } 100% { background: transparent }` — 200ms.
- `blink`: `0%,49% { opacity: 1 } 50%,100% { opacity: 0.25 }` — 1s steps(2).
- `pulse-blood`: `box-shadow` entre `0 0 0 0 rgba(225,29,42,0.6)` y `0 0 0 12px transparent`.
- `quake`: `0%,100% { transform: translate(0,0) } 20% { transform: translate(-2px,1px) } 40% { transform: translate(2px,-1px) } 60% { transform: translate(-1px,2px) } 80% { transform: translate(1px,-2px) }` — 0.8s, se aplica **solo** al título "POR CARACAS Y LA GUAIRA" en hover de la card (evitar distracción constante).
- `rise-in`: `from { opacity:0; transform: translateY(40px) } to { opacity:1; transform: none }` — 700ms, activado por `IntersectionObserver`.

### 8.2 Estados hover / focus

- **Botones primarios:** `hover:bg-flame-glow`, `active:scale-[0.98]`, `focus-visible:outline-2 outline-offset-4 outline-flame`.
- **Botones outline (cyan):** `hover:bg-cyan/10`, `hover:shadow-[0_0_30px_rgba(25,227,255,0.4)]`.
- **Cards FighterCard:** `hover:-translate-y-1`, ring neón se intensifica, avatar crece `scale(1.03)`.
- **Chips de monto:** `hover:border-flame`, activo lleva glow flame.
- **"Ready to Fight" easter egg:** al mantener hover 1.2s sobre cualquier FighterCard, aparece un texto `"READY TO FIGHT"` en `font-display text-blood` que entra con `skew(-10deg)` y `hit-flash`.

### 8.3 Reveal on scroll

Cada `<section>` arranca con `opacity-0 translate-y-10` y clase `is-visible` añadida por `IntersectionObserver` (threshold 0.15). Transition `700ms ease-out`. Stagger de 80ms entre hijos directos.

### 8.4 prefers-reduced-motion

Deshabilitar `vs-throb`, `neon-flicker`, `hit-flash`, `pulse-blood`. Revelar secciones sin transform. Respetar siempre.

---

## 9. DATOS MOCK / CONSTANTES

Centralizar en un bloque de frontmatter o `src/data/event.ts`:

```ts
export const EVENT = {
  dateISO: "2026-07-25T20:00:00-04:00", // {{EVENT_DATE_ISO}}
  dateLabel: "25 JUL 2026",
  timeLabel: "8:00 PM VET",
  twitchChannel: "{{TWITCH_CHANNEL}}",   // TODO: reemplazar
  host: "enc-gambling.pages.dev",         // TODO: dominio real para parent de Twitch
  gofundme: "{{GOFUNDME_URL}}",           // TODO: reemplazar — ayuda humanitaria terremoto 24/06
  goalUSD: 50000,                          // meta de ayuda
  raisedUSD: 1240,
  hashtag: "#EncClasificatorio",
};

export const P1 = {
  name: "{{PLAYER_1}}",
  gt: "{{PLAYER_1_GT}}",
  char: "{{CHAR_P1}}",
  record: "23-4",
  accent: "cyan",
  pct: 52,
};

export const P2 = {
  name: "{{PLAYER_2}}",
  gt: "{{PLAYER_2_GT}}",
  char: "{{CHAR_P2}}",
  record: "21-6",
  accent: "flame",
  pct: 48,
};
```

> Todos los `{{PLACEHOLDERS}}` deben quedar como strings literales visibles en el código para que el humano los reemplace con un find/replace posterior.

---

## 10. RESPONSIVE / BREAKPOINTS

- **Mobile-first.** Breakpoints Tailwind default: `sm 640, md 768, lg 1024, xl 1280`.
- **HeroVS:** mobile → stack vertical (`P1 / VS / P2`), VS escala `clamp(6rem, 30vw, 12rem)`. Desktop → 3 columnas asimétricas.
- **PredictionBar:** barras siempre full width; los botones de voto pasan de 1 col (mobile) a 2 col (`md`).
- **DonationCard:** single column siempre; padding `p-6 sm:p-10`.
- **EventDetails:** grid `grid-cols-1 md:grid-cols-2 gap-8`. Twitch embed `aspect-video` en todos los tamaños.
- **StickyHeader:** en `sm` se ocultan el countdown mini y el label del CTA, queda solo icono + logo.
- Tipografía fluida con `clamp()` en todos los titulares para evitar overflow.

---

## 11. SEO / META / OG

`Layout.astro` `<head>` debe incluir:
```html
<html lang="es">
<title>ENC Clasificatorio — Duelo Final Venezuela | Street Fighter 6</title>
<meta name="description" content="El duelo final por el último puesto del equipo Venezuela para la Esports Nations Cup en Street Fighter 6. Pronostica, apoya y asiste en vivo." />
<meta property="og:title" content="ENC Clasificatorio — Duelo Final Venezuela" />
<meta property="og:description" content="Dos luchadores. Una nación. El boleto a la ENC." />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og.jpg" />
<meta name="theme-color" content="#05050a" />
```
Pre-cargar fuentes con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.

---

## 12. CRITERIOS DE ACEPTACIÓN (CHECKLIST)

- [ ] `npm install` + `npm run build` pasan sin errores.
- [ ] Tailwind v4 integrado vía `@tailwindcss/vite`, tokens en `@theme` aplicados.
- [ ] Las 4 secciones (`HeroVS`, `PredictionBar`, `DonationCard`, `EventDetails`) renderizadas en `index.astro` dentro de `Layout`.
- [ ] Dualidad cromática Player 1 (cyan) / Player 2 (flame) consistente en toda la página.
- [ ] "VS" gigante con gradiente cyan→flame, `skew`, glow y animación `vs-throb`.
- [ ] Barras de pronóstico animadas con votación local (localStorage) y flash de golpe.
- [ ] Selector de monto funcional + CTA GoFundMe con `href="{{GOFUNDME_URL}}"` y `target="_blank"`, claramente enfocado a **ayuda humanitaria por el terremoto** (no a logística deportiva).
- [ ] Countdown hasta `{{EVENT_DATE_ISO}}` con bloques D/H/M/S y estado "EN VIVO" al llegar a 0.
- [ ] Twitch iframe embed apuntando a `{{TWITCH_CHANNEL}}` con `parent` correcto.
- [ ] Todos los placeholders `{{...}}` visibles y sin reemplazar en el código final.
- [ ] `prefers-reduced-motion` respetado en todas las animaciones.
- [ ] Responsive correcto en 375 / 768 / 1280 px.
- [ ] Sin dependencias adicionales más allá de `astro`, `tailwindcss`, `@tailwindcss/vite`.

---

### NOTAS FINALES PARA MINIMAX M3

- Inventa *pequeños detalles visuales extra* que refuercen el tema (esquinas "cut" tipo arcade, halos, slash decorativos, noise grain) siempre que no rompan el layout.
- Mantén el código limpio, componentes pequeños y reutilizables, y comentarios CERO (salvo `TODO:` para los placeholders).
- Entrega el resultado como edición directa de los archivos del proyecto (ver sección 5.1), no como un sandbox aislado.

# GoFundMe Scraper · Cloudflare Worker

Serverless worker que scrapea la campaña de GoFundMe **Venezuela FG Community: Earthquake Relief** cada 30 minutos, cachea el monto en Cloudflare KV y lo expone como JSON público para la landing de Astro.

> **⚠️ Aviso legal:** los GoFundMe Terms of Service (Effective June 23, 2026), §12.3, prohíben expresamente *"data mining, spiders, robots, scraping, or similar data gathering or extraction methods"* sobre cualquier *Services Content*. Este worker realiza scraping del monto recaudado, que es **dato públicamente visible** en la página de la campaña, pero técnicamente viola los TOS. La campaña es 100% humanitaria y el riesgo percibido es bajo, pero **procede bajo tu propia responsabilidad**.

## Setup (one-time)

```sh
cd workers/gofundme-scraper
npm install
npx wrangler login
npx wrangler kv namespace create GFM_DATA
```

Copia el `id` que devuelve el último comando y reemplaza `REPLACE_AFTER_WRANGLER_KV_CREATE` en `wrangler.toml`.

## Deploy

```sh
npx wrangler deploy
```

Al terminar, Wrangler imprime la URL del worker, algo como:

```
Published enc-gofundme-scraper
  https://enc-gofundme-scraper.<tu-subdominio>.workers.dev
```

El endpoint público será:

```
https://enc-gofundme-scraper.<tu-subdominio>.workers.dev/api/gofundme
```

## Conectar a la landing

En el `.env` del proyecto raíz (Astro), agrega:

```sh
PUBLIC_GOFUNDME_API_URL=https://enc-gofundme-scraper.<tu-subdominio>.workers.dev/api/gofundme
```

Listo. La landing hará `fetch` a esa URL client-side al cargar y actualizará el monto si difiere del hardcode fallback.

## Test local

```sh
npx wrangler dev
```

Levanta un servidor local en `http://localhost:8787/api/gofundme`.

Para forzar un refresh inmediato (en vez de esperar al cron):

```sh
curl http://localhost:8787/api/gofundme
```

(El primer request dispara `refresh()` si el KV está vacío.)

## Ver logs en vivo

```sh
npx wrangler tail
```

## Ajustar la frecuencia del cron

En `wrangler.toml`:

```toml
[triggers]
crons = ["*/30 * * * *"]  # cada 30 min
```

Otros patrones comunes:
- `"*/15 * * * *"` — cada 15 min
- `"0 * * * *"` — cada hora
- `"0 */6 * * *"` — cada 6 horas

Free tier: hasta 5 cron triggers.

## Cambiar la URL de la campaña

Edita `CAMPAIGN_URL` en `src/index.ts` y vuelve a `npx wrangler deploy`.

## Cambiar la estrategia de parsing

Si GoFundMe actualiza su HTML y el scraper deja de funcionar, los logs en `wrangler tail` mostrarán `[scraper] parse failed`. Las estrategias actuales en `parse()` son:

1. **JSON hydration** — busca `"current_amount"`, `"goal_amount"`, `"donation_count"` en bloques `<script>`.
2. **Visible text** — busca patrón `$\d+ raised` en el HTML.

Agrega más estrategias según el HTML que veas en `wrangler tail` capturando el HTML:

```ts
await env.GFM_DATA.put("debug-html", html, { expirationTtl: 600 });
```

Y luego descárgalo:

```sh
npx wrangler kv key get --binding=GFM_DATA debug-html > debug.html
```

## Costos

| Recurso | Free tier | Uso estimado |
|---|---|---|
| Workers requests | 100k/día | ~50/día |
| Workers CPU | 10ms (free) / ilimitado ($5/mes) | ~150ms/scrap |
| KV reads | 100k/día | ~5k/día |
| KV writes | 1k/día | ~50/día |
| Cron Triggers | 5 | 1 |

**Costo estimado: $0–$5/mes.** Si un scraper tarda más de 10ms, Workers emite warning. Si te excedes del free tier en CPU, Wrangler te cobra el plan de $5 automáticamente.

## Estructura

```
workers/gofundme-scraper/
├── src/index.ts          # worker code (scheduled + fetch handlers)
├── wrangler.toml         # config (KV binding + cron)
├── package.json          # deps (wrangler, types)
├── tsconfig.json         # TS config
└── README.md             # este archivo
```

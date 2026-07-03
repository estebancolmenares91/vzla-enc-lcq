# Deploy · ENC Clasificatorio Landing

## Stack en producción

| Componente | Plataforma | Free tier |
|---|---|---|
| Landing (Astro static) | **Cloudflare Pages** | Ilimitado |
| Worker scraper (GoFundMe) | **Cloudflare Workers** | 100k req/día |
| KV cache | **Cloudflare KV** | 100k reads/día |
| Auth + votos | **Supabase** | 500MB DB, 50k MAU |

Todo en el mismo dashboard de Cloudflare (Pages + Workers + KV), sin servicios externos adicionales.

---

## 1. Desplegar el sitio (Cloudflare Pages)

### Opción A — Conectar repo Git (recomendado)

1. **Cloudflare Dashboard** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Selecciona el repo `enc-gambling` (o como se llame)
3. **Build settings:**
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (deja vacío)
4. **Environment variables** (sección "Environment variables"):
   ```
   PUBLIC_SUPABASE_URL          = https://drkletnzoawu....supabase.co
   PUBLIC_SUPABASE_ANON_KEY     = eyJhbGciOiJIUzI1NiIsInR5...
   PUBLIC_GOFUNDME_API_URL      = https://enc-gofundme-scraper.<sub>.workers.dev/api/gofundme
   ```
   (El último se llena después de desplegar el worker — ver paso 2.)
5. **Save and Deploy**. Cada push a `main` redespliega automáticamente.

### Opción B — Deploy manual con Wrangler

```sh
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=enc-gambling
```

---

## 2. Desplegar el worker (GoFundMe scraper)

```sh
cd workers/gofundme-scraper
npm install
npx wrangler login
npx wrangler kv namespace create GFM_DATA
```

Copia el `id` que devuelve el último comando en `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "GFM_DATA"
id = "abc123..."  # ← pegar aquí
```

Desplegar:

```sh
npx wrangler deploy
```

Wrangler imprime la URL, ej:

```
Published enc-gofundme-scraper
  https://enc-gofundme-scraper.<tu-subdominio>.workers.dev
```

Endpoint público:

```
https://enc-gofundme-scraper.<tu-subdominio>.workers.dev/api/gofundme
```

### Conectar al sitio

Vuelve a **Cloudflare Pages** → tu proyecto → **Settings** → **Environment variables** y agrega (o actualiza):

```
PUBLIC_GOFUNDME_API_URL = https://enc-gofundme-scraper.<tu-subdominio>.workers.dev/api/gofundme
```

Redeploy el sitio (push vacío a `main`, o **Retry deployment** en el dashboard).

---

## 3. Verificar que todo funciona

### 3.1 — Landing carga
Abre la URL de Pages (ej. `https://enc-gambling.pages.dev`) y verifica:
- Hero con VS y fighters
- Countdown activo
- Botón "Apoya la campaña" en el hero lleva a `#donar`
- Sección `#donar` muestra "$4,323 / $18,000" (o el monto actual)

### 3.2 — Worker corre el primer scrape
Espera hasta 30 min (primer cron), o fuerza un fetch al endpoint público:

```sh
curl https://enc-gofundme-scraper.<sub>.workers.dev/api/gofundme
```

Si KV está vacío todavía, devuelve 503. Si ya scrapió, devuelve JSON.

### 3.3 — Live update en la landing
Una vez el worker tiene datos:
1. Abre la landing en el browser
2. Abre DevTools → Network → filtra por `gofundme`
3. Debe aparecer un request al endpoint del worker
4. El monto y la barra deben actualizarse al valor del worker (si difiere del hardcode)

---

## 4. Logs y debugging

### Ver logs del worker en vivo
```sh
cd workers/gofundme-scraper
npx wrangler tail
```

Para ver si el scraper está fallando, busca `[scraper] parse failed` o `[scraper] HTTP <código>`.

### Forzar un refresh manual
```sh
curl https://enc-gofundme-scraper.<sub>.workers.dev/api/gofundme
```
(El primer request dispara `refresh()` si el KV está vacío.)

Si necesitas escribir manualmente un valor (mientras arreglas el parser):

```sh
npx wrangler kv key put --binding=GFM_DATA campaign '{"raised":4323,"goal":18000,"percent":24,"donors":76,"source":"manual","updatedAt":"2026-07-03T00:00:00Z"}' --expiration-ttl 3600
```

---

## 5. Costos estimados

| Recurso | Free tier | Uso real |
|---|---|---|
| Pages requests | Ilimitado | ~1k-50k/mes |
| Pages build minutes | 500/mes | ~2 min × 30 deploys = 60 min/mes |
| Workers requests | 100k/día | ~50/día |
| Workers CPU | 10ms (free) | ~150ms/scrap → upgrade a $5/mes |
| KV reads | 100k/día | ~5k/día |
| KV writes | 1k/día | ~50/día |
| Cron triggers | 5 | 1 |

**Total estimado: $0/mes si el scraper cabe en 10ms CPU, o $5/mes si no.**

Para optimizar CPU, el scraper podría usar streams o cheerio. Por ahora entra en free tier la mayoría de los días.

---

## 6. Dominio custom

Si tienes un dominio (ej. `enc-fgc.com`):

1. **Cloudflare Pages** → tu proyecto → **Custom domains** → **Set up a custom domain**
2. Sigue las instrucciones para apuntar el DNS
3. Cloudflare emite el cert TLS automáticamente

El worker puede quedarse en `*.workers.dev` (subdominio gratuito) o también mapear a un subdominio custom (`api.enc-fgc.com`).

---

## Resumen de URLs

| Recurso | URL |
|---|---|
| Landing | `https://enc-gambling.pages.dev` (o tu dominio) |
| Worker (API) | `https://enc-gofundme-scraper.<sub>.workers.dev/api/gofundme` |
| GoFundMe | `https://www.gofundme.com/f/venezuela-fg-community-earthquake-relief` |
| Twitch | `https://twitch.tv/<canal>` |
| Supabase | `https://<project-ref>.supabase.co` |

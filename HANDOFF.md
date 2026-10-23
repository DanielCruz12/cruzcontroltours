# HANDOFF — Cruz Control Tours (Next.js)

Contexto acumulado del proyecto para continuar el trabajo sin volver a preguntar.
**Actualiza este archivo al terminar cada sesión.**

Última actualización: 2026-10-23

## Stack

- **Next.js 16.3.8** (App Router + Turbopack) — ⚠️ Este Next.js tiene breaking changes: leer las guías en `node_modules/next/dist/docs/01-app/` ANTES de escribir código.
- React 19.2.8, TypeScript, **Tailwind CSS v4** (config CSS-first con `@theme` en `app/globals.css`), pnpm.
- Estructura:
  - `app/` — layout, página home (`page.tsx`) y `/tours`
  - `components/` — Header, Hero, TourSearch, ToursSections, TourCard, Footer, icons
  - `lib/tours.ts` — catálogo estático de tours (9 tours: 5 populares + 4 otros)
  - `public/` — `logocruztours.png` y `videos/1.mp4`, `2.mp4`, `3.mp4`

## Decisiones tomadas (NO volver a preguntar)

- **Escala global**: `zoom: 0.8` en `html` a partir de 768px (`app/globals.css`). El usuario validó el diseño con zoom al 80% en Chrome. Para ajustar el tamaño general del sitio se cambia ese valor (p. ej. 0.85). En móvil (<768px) se mantiene 100% para legibilidad.
- **Color `charcoal`**: no existe por defecto en Tailwind v4 — se definió `--color-charcoal: #2a2a2a` en `@theme` (antes TODAS las clases `*-charcoal*` no generaban CSS: hero sin fondo, overlays sin degradado, etc.).
- **Color de marca** `--color-brand: #000000` — negro (el del logotipo/banner). Antes era `--color-brand-blue: #3890c8` (azul extraído del logo), pero el usuario pidió cambiarlo a negro. Se usa en: CTA, hover del botón de búsqueda, borde al enfocar los inputs y texto del botón de WhatsApp.
- **Cards de tours del mismo tamaño**: grids unificados a `md:3 / xl:4` columnas en todas las secciones (se eliminó `2xl:5` que hacía las cards populares más chicas que las otras) + altura fija de 2 líneas para el nombre (`min-h-[2.75em]`) y ubicación con `truncate` en `TourCard`.
- **Buscador glassmorphism**: `TourSearch` superpuesto al hero con `-mt-32 md:-mt-40` y cristal **blanco translúcido** (`bg-white/45` + `backdrop-blur-2xl`). Los inputs son **transparentes** (solo borde `white/90`) para verse del mismo tono que el panel — el usuario pidió uniformidad total; al enfocar, borde azul + `bg-white/15` sutil. Primero se probó cristal oscuro, luego inputs con blanco propio (se veían más claros).

## Hero con videos (components/Hero.tsx)

- Videos locales `/videos/1.mp4`, `2.mp4`, `3.mp4` (el usuario pidió exactamente estos).
- **Crossfade, no carrusel**: dos capas `<video>` superpuestas; la capa trasera se funde a opacidad 1 mientras la delantera baja a 0 (1.2s, `CROSSFADE_MS`). Sin flechas ni desplazamiento.
- Arquitectura: la capa 0 lleva escenas pares y la capa 1 las impares; el cambio de `src` **siempre ocurre en la capa oculta** (nunca se recrean elementos, sin parpadeos). Todo el motor de secuencia vive en un solo `useEffect` de montaje con un único juego de temporizadores.
- Tiempos: escena de 10s (`SCENE_MS`), precarga del siguiente 2s antes (`PREP_MS`), timeout de 5s (`READY_TIMEOUT_MS`) → si el video no está listo se muestra la imagen de respaldo y el ciclo continúa. Los videos usan `muted + playsInline + loop` y `preload="metadata"` en la capa oculta (nunca se descargan todos a la vez).
- **Imagen de respaldo / de carga**: foto de Unsplash como capa base debajo de los videos. Se ve: mientras carga el primer video (entra con fade-in al primer evento `playing`), sin JavaScript, con `prefers-reduced-motion`, en conexiones `saveData`/`slow-2g`, o si un video falla/tarda (con reintento en cada ciclo).
- Config `SCENES` en el propio archivo: `src`, `mobileSrc` opcional (aún NO existen los archivos móvil — colocar p. ej. `/videos/1-mobile.mp4`), `position` (punto focal de `object-position`).
- Duración natural: `1.mp4` ≈ 8s; `2.mp4` y `3.mp4` son MP4 fragmentados (moof/mdat) sin duración confiable en metadatos → por eso se usa duración fija por escena.

## Estado actual del proyecto

- El buscador filtra solo los tours populares de la home (por `destination`).
- Datos de tours (`lib/tours.ts`) y todas las fotos son **temporales** (Unsplash): pendiente backend/fotos propias.
- Selector de idioma: EN marcado "Pronto" (deshabilitado) en `Header.tsx`.
- Footer usa datos de contacto ficticios (+503 0000 0000, info@cruzcontroltours.com).

## Pendientes / recomendaciones

- ⚠️ **`2.mp4` pesa 79.5 MB** — comprimir/re-encodificar (H.264, ~1080p, 2–4 Mbps). Hoy se descarga por streaming solo cuando toca su turno, pero en móvil gasta muchos datos. (`1.mp4` = 2.7 MB, `3.mp4` = 16 MB.)
- Reemplazar la imagen de respaldo de Unsplash por fotografía propia.
- Crear versiones `mobileSrc` livianas de los videos si importa el dato móvil.

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # build de producción (verifica tipos)
npm start       # servir el build
npm run lint    # eslint
```

## Historial de sesiones

### 2026-10-23 — buscador con glassmorphism y más subido

1. `components/TourSearch.tsx`: buscador más superpuesto al hero (`-mt-28 md:-mt-36`) y con estilo glassmorphism oscuro (`bg-charcoal/55 móvil / 40 desktop` + `backdrop-blur-2xl`, bordes blancos, campos `bg-white/10` con texto blanco, `[color-scheme:dark]` para el input de fecha, botón blanco que pasa a azul de marca en hover). Iconos de etiquetas en `brand-blue`.
2. `components/Hero.tsx`: padding inferior aumentado (`pb-44 sm:pb-48 lg:pb-52`) para reservar espacio del buscador más alto.
3. Nota: el usuario ajustó el h1 del hero ("El Salvador" en su propia línea con `<br />`, sin el azul de marca) — no revertir ese cambio.
4. Build de producción verificado sin errores.

### 2026-10-23 (2) — buscador más blanco y footer real

1. `components/TourSearch.tsx`: el cristal cambió a **blanco translúcido** (`bg-white/45`, campos `bg-white/75`, texto oscuro, botón `bg-charcoal` con hover azul). Se quitó `[color-scheme:dark]`.
2. `components/Footer.tsx`: reescrito con información real del negocio — logo grande (`/logocruztours.png`, `h-32 sm:h-40` sobre panel blanco), "Cruz Tours" + descripción, horario (Lun–Sáb 8–6), atención (tours privados y grupales), destinos (El Salvador, Nicaragua, Honduras, Guatemala), contacto real (dirección con enlace a Google Maps, WhatsApp +503 6050 3161 → `wa.me/50360503161`, correo cruzcontroltours@gmail.com) y CTA "¿Listo para viajar?" con botón de WhatsApp.
3. Se eliminaron los enlaces rápidos del footer (la nueva estructura es Marca/Destinos/Contacto).
4. Build de producción verificado sin errores.

### 2026-10-23 (3) — inputs con cristal y buscador más arriba

1. `components/TourSearch.tsx`: los inputs ahora también son translúcidos (`bg-white/55`, borde `white/80`, al enfocar `bg-white/85`); el buscador sube a `-mt-32 md:-mt-40`.
2. `components/Hero.tsx`: padding inferior aumentado a `pb-48 sm:pb-52 lg:pb-56` para el buscador más alto.
3. Build de producción verificado sin errores.

### 2026-10-23 (4) — inputs del mismo tono que el panel

1. `components/TourSearch.tsx`: los inputs pasaron a `bg-transparent` (solo borde `white/90`) porque con fondo propio se veían más claros que el panel; el usuario pidió que todo se viera igual. Al enfocar: borde azul de marca + `bg-white/15` sutil.
2. Build de producción verificado sin errores.

### 2026-10-23 (5) — inputs un poco más blancos

1. `components/TourSearch.tsx`: los inputs pasaron de transparentes a un velo blanco sutil (`bg-white/20`, al enfocar `bg-white/30`) — punto medio entre uniformidad total y un poco más de definición.
2. El usuario también quitó el color azul de los iconos de las etiquetas y el borde del panel del form — no revertir.
3. Build de producción verificado sin errores.

### 2026-10-23 (6) — borde de los inputs

1. `components/TourSearch.tsx`: el borde de los inputs pasó de `border-white/90` (casi invisible sobre el cristal blanco) a `border-charcoal/15` y luego a `border-charcoal/25` (más marcado, lo pidió el usuario); al enfocar sigue con `border-brand-blue`.
2. Build de producción verificado sin errores.

### 2026-10-23 (7) — CTA "¿Listo para viajar?" fuera del footer

1. Nuevo `components/CtaSection.tsx`: franja azul de marca (`bg-brand-blue`) con el título, el texto y el botón de WhatsApp, ubicada **arriba del footer** en ambas páginas (`app/page.tsx` y `app/tours/page.tsx`).
2. `components/Footer.tsx`: se eliminó el bloque CTA de adentro.
3. Nota: el usuario ajustó por su cuenta los inputs (`border-charcoal/40 bg-white/40`) y los paddings de las secciones de tours (`py-40` en populares, `pb-20` sin fondo en otras opciones) — no revertir.
4. Build de producción verificado sin errores.

### 2026-10-23 (8) — video de fondo en el CTA

1. `components/CtaSection.tsx`: ahora tiene `/videos/1.mp4` de fondo (el más liviano, 2.7 MB) en bucle muted + `playsInline`, con overlay degradado `from-brand-blue/90 via-brand-blue/65 to-charcoal/70` para legibilidad. Con `prefers-reduced-motion` el video se oculta (`motion-reduce:hidden`) y queda la franja azul lisa. Franja un poco más alta (`py-16 sm:py-20`).
2. Build de producción verificado sin errores.

### 2026-10-23 (9) — color de marca: de azul a negro

1. `app/globals.css`: `--color-brand-blue: #3890c8` renombrado a `--color-brand: #000000` (el usuario pidió "negro, del banner").
2. Usos actualizados: `TourSearch` (focus del input y hover del botón), `CtaSection` (fondo negro + overlay `from-brand/90 via-brand/60 to-charcoal/70`, texto del botón), e iconos del footer (pasaron a `text-white/80` porque en negro no se verían sobre el fondo oscuro).
3. Build de producción verificado sin errores.

### 2026-10-22 — tamaño del sitio, cards iguales y hero con videos

1. `app/globals.css`: definidos `--color-charcoal` (faltante), `--color-brand-blue`, y `zoom: 0.8` en `html` ≥768px.
2. `components/Hero.tsx`: reescrito — crossfade cinematográfico con `/videos/1..3.mp4`, imagen de respaldo, fade-in del primer video, accesibilidad y manejo de errores. "El Salvador" ahora en azul de marca.
3. `components/TourCard.tsx`, `components/ToursSections.tsx`, `app/tours/page.tsx`: todas las cards con el mismo tamaño (altura fija del nombre, truncate en ubicación, columnas unificadas).
4. `HANDOFF.md`: creado este archivo.
5. Build de producción verificado sin errores de TypeScript.

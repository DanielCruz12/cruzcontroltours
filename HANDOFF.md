# HANDOFF — Cruz Control Tours (Next.js)

Contexto acumulado del proyecto para continuar el trabajo sin volver a preguntar.
**Actualiza este archivo al terminar cada sesión.**

Última actualización: 2026-10-24

## Stack

- **Next.js 16.3.8** (App Router + Turbopack) — ⚠️ Este Next.js tiene breaking changes: leer las guías en `node_modules/next/dist/docs/01-app/` ANTES de escribir código.
- React 19.2.8, TypeScript, **Tailwind CSS v4** (config CSS-first con `@theme` en `app/globals.css`), pnpm.
- Estructura:
  - `app/` — layout, página home (`page.tsx`) y `/tours`
  - `components/` — Header, Hero, TourSearch, PopularToursSection, OtherToursSection, TourCard, TeamSection, GallerySection, CtaSection, ScrollToTop, Footer, icons
  - `lib/tours.ts` — catálogo estático de tours (9 tours: 5 populares + 4 otros)
  - `lib/team.ts` — equipo (⚠️ contenido ilustrativo temporal)
  - `lib/gallery.ts` — galería "Momentos inolvidables" (⚠️ fotos temporales Unsplash, verificadas)
  - `public/` — `logocruztours.png` y `videos/1.mp4`, `2.mp4`, `3.mp4`
- Orden de la home: Hero → Tours populares (con buscador) → **TeamSection → Otras opciones → GallerySection** → (main) → CtaSection → Footer. La galería separa a "Otras opciones" del CTA y el equipo no queda unido al CTA (el usuario pidió ambas cosas).

## Decisiones tomadas (NO volver a preguntar)

- **Escala global**: `zoom: 0.8` en `html` a partir de 768px (`app/globals.css`). El usuario validó el diseño con zoom al 80% en Chrome. Para ajustar el tamaño general del sitio se cambia ese valor (p. ej. 0.85). En móvil (<768px) se mantiene 100% para legibilidad.
- **Color `charcoal`**: no existe por defecto en Tailwind v4 — se definió `--color-charcoal: #2a2a2a` en `@theme` (antes TODAS las clases `*-charcoal*` no generaban CSS: hero sin fondo, overlays sin degradado, etc.).
- **Paleta azul oficial (solo light mode)** — ver la sección "Paleta azul oficial" más abajo. Sustituye la decisión anterior de marca negra (sesión 9): `brand` y `primary` ahora son azul profundo `#0082B6`.
- **Cards de tours del mismo tamaño**: grids unificados a `md:3 / xl:4` columnas en todas las secciones (se eliminó `2xl:5` que hacía las cards populares más chicas que las otras) + altura fija de 2 líneas para el nombre (`min-h-[2.75em]`) y ubicación con `truncate` en `TourCard`.
- **Buscador glassmorphism**: `TourSearch` superpuesto al hero con `-mt-32 md:-mt-40` y cristal **blanco translúcido** (`bg-white/45` + `backdrop-blur-2xl`). Los inputs son **transparentes** (solo borde `white/90`) para verse del mismo tono que el panel — el usuario pidió uniformidad total; al enfocar, borde azul + `bg-white/15` sutil. Primero se probó cristal oscuro, luego inputs con blanco propio (se veían más claros).

## Paleta azul oficial (solo light mode)

- Paleta: azul cielo `#3AA8DF`, azul claro `#64C4EF`, azul profundo `#0082B6`, azul pálido `#BBD8EB`, blanco, negro y gris `#444444`. **La paleta roja queda reservada para un futuro dark mode** — no implementarlo todavía.
- Tokens en `@theme` (`app/globals.css`): `sky`, `sky-light`, `sky-deep`, `sky-pale` + tokens semánticos remapeados: `brand` y `primary` = azul profundo, `surface` = blanco, `ink` = negro, `ink-soft` = gris #444, `charcoal` = negro (hero, overlays y sombras). Se eliminaron `navy`, `azure` y `primary-dark`.
- Reglas de uso: fondos blancos (azul pálido solo en hovers, placeholders y estados activos), botones principales/acciones en azul profundo, iconos/etiquetas/destacados en azul cielo o claro, footer negro con acentos azul cielo.
- Contraste: blanco sobre azul profundo = 4.3:1 (pasa AA en texto grande; es el techo que permite la paleta — el azul profundo es el azul más oscuro disponible), azul cielo sobre negro = 7.9:1, gris sobre blanco = 9:1. En franjas `bg-sky-deep`/`bg-brand` el outline de foco pasa a blanco (regla en globals.css).

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
- Datos de tours (`lib/tours.ts`), equipo (`lib/team.ts`), galería (`lib/gallery.ts`) y todas las fotos son **temporales** (Unsplash / contenido ilustrativo): pendiente backend/fotos/testimonios/equipo reales.
- Selector de idioma: EN marcado "Pronto" (deshabilitado) en `Header.tsx`.
- Footer usa datos de contacto reales (sesión 2): dirección, WhatsApp +503 6050 3161 y correo.

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

### 2026-10-24 (16) — galería animada en móvil y equipo a pantalla completa

1. `lib/gallery.ts` + `components/GallerySection.tsx`: en móvil la galería dejó de ser un grid 2 columnas estático y ahora usa las mismas **filas flex con el movimiento vinculado al scroll** (se eliminó el corte `<768px` del efecto; solo `prefers-reduced-motion` queda estático). La config ahora lleva clases móvil + md: alturas de fila `h-[200px]/[250px]/[210px]` y anchos de tarjeta `w-[130px]–[210px]` (desktop intacto: 300–400px / 260–420px). Se eliminó el campo `wide` (era el `col-span-2` del grid móvil) y las clases `aspect` de la tarjeta (la fila fija la altura y cada tarjeta su ancho); `aspect` sigue definiendo las dimensiones del lightbox. `sizes` del `<Image>` actualizado: 210px móvil / 420px md+.
2. `components/TeamSection.tsx`: la franja "Nuestro equipo" ahora ocupa `min-h-screen` (100vh) en todos los tamaños. Con el zoom global 0.8 los `vh` se dividen por el zoom efectivo, así que renderiza exactamente una pantalla completa.
3. Build de producción y lint verificados (100 % limpio).

### 2026-10-23 (15) — "Otras opciones" debajo del equipo

1. `ToursSections.tsx` se dividió en dos componentes: **`PopularToursSection.tsx`** (buscador superpuesto + sección "Tours más populares" con el estado de filtros) y **`OtherToursSection.tsx`** ("Otras opciones", server component sin estado).
2. Nuevo orden de la home: Hero → Populares → Equipo → **Otras opciones** → Galería → CTA. El usuario pidió que "Otras opciones" quede debajo de "Nuestro equipo".
3. Build y lint verificados.

### 2026-10-23 (14) — "Nuestro equipo" y galería Masonry animada

1. `TestimonialsSection` → **`TeamSection`** (`lib/testimonials.ts` → `lib/team.ts`): misma mecánica de fundidos (slider con autoplay 6 s, flechas, indicadores), ahora con miembros del equipo (⚠️ datos ilustrativos: nombre, cargo y frase personal por miembro; soporta `image?`). Orden de la home: Hero → Tours → **Equipo → Galería** → CTA — el usuario pidió que el equipo NO quede unido al CTA (la galería los separa).
2. Nuevo `lib/gallery.ts` + `components/GallerySection.tsx` — galería editorial Masonry sobre fondo negro:
   - **Movimiento por scroll**: 4 filas flex (md+) que se desplazan en direcciones alternas (pares ←, impares →) con `translate3d` vinculado al progreso de la sección en el viewport (0 al entrar → 1 al salir, reversible). Un solo listener pasivo de scroll agenda un rAF; **sin estado de React durante el scroll**. Recorrido por fila = `min(travel configurado, mitad del desbordamiento medido)` — nunca deja huecos. La clase `md:min-w-[calc(100%_+_300px)]` garantiza ≥150 px de recorrido por lado con cualquier pantalla/zoom. Estático en <768 px y con `prefers-reduced-motion`. Medición en montaje + resize; listeners y rAF limpiados al desmontar.
   - **Hover**: borde azul cielo (`hover:ring-sky`), overlay oscuro + título + icono `ExpandIcon` (también con foco), escala 1.04 en un contenedor **interno** (nunca se pisa con el translate de la fila). El destino se muestra siempre (táctil sin hover).
   - **Lightbox**: diálogo `fixed` con fondo negro, cierre (X + clic en el fondo + Escape), flechas anterior/siguiente (botones + teclado), trampa de foco, `aria-modal`, devolución de foco a la tarjeta que abrió, bloqueo de scroll del body y contador. No provoca saltos de página.
   - Responsive: móvil = grid 2 columnas con alturas variables (una tarjeta panorámica `col-span-2` por fila) y estático; md+ = filas con altura fija por fila (300/380/320/400 px) y anchos variables de tarjeta (260–420 px).
   - Fotos: 24 instancias de 19 URLs Unsplash (las 9 del proyecto + 10 nuevas **verificadas con HTTP 200**), configurables en `lib/gallery.ts` (título, destino, alt, aspect, ancho, object-position). Reemplazar por fotografía real.
3. `app/globals.css`: outline de foco azul cielo dentro de `bg-black` (galería y footer).
4. Build de producción y lint verificados (lint 100 % limpio: el usuario añadió el `eslint-disable` de `react-hooks/set-state-in-effect` en `TourCard.tsx`, mismo patrón que `Hero.tsx`).

### 2026-10-23 (12) — sección de testimonios con fundidos

1. Nuevo `components/TestimonialsSection.tsx`: franja de ancho completo con testimonios en **fundido cruzado, no carrusel** — los slides se apilan en la misma celda de un grid (`col-start-1 row-start-1`), así el más largo define la altura (sin saltos) y el cambio es solo de opacidad (500 ms, misma posición). Autoplay de 6 s (se reinicia con la navegación manual y se pausa con hover/foco dentro de la sección); con `prefers-reduced-motion` no hay autoplay (el CSS global ya hace el cambio instantáneo). Flechas circulares en los extremos en `lg+` y junto a los indicadores en móvil/tablet (no se pisan con el texto). A11y: `aria-live="polite"`, slides inactivos con `inert` + `aria-hidden`, indicadores con `aria-current` y `aria-label`.
2. Datos en `lib/testimonials.ts` — ⚠️ contenido ilustrativo temporal (marcado en el archivo), reemplazar por testimonios reales antes de producción.
3. Montada en la home entre `ToursSections` y `CtaSection`. Iconos `ChevronLeftIcon`/`ChevronRightIcon` agregados a `icons.tsx`.
4. Build verificado. Lint: sin errores nuevos (sigue el pre-existente de `TourCard`).

### 2026-10-23 (13) — paleta azul oficial en todo el sitio (solo light mode)

1. `app/globals.css`: `@theme` remapeado a la paleta oficial (ver sección "Paleta azul oficial"): tokens `sky`, `sky-light`, `sky-deep`, `sky-pale` nuevos; `brand`/`primary` → azul profundo, `surface` → blanco, `ink` → negro, `ink-soft` → gris #444, `charcoal` → negro; eliminados `navy`, `azure` y `primary-dark`. Regla nueva: outline de foco blanco dentro de `bg-sky-deep`/`bg-brand`.
2. Ajustes por componente: `TestimonialsSection` pasó de `bg-azure` a `bg-sky-deep` (comillas y anillos en `sky-light`, cargo `white/90`); `Header` hovers y activos del menú en `sky-pale`; `TourCard` placeholder de imagen en `sky-pale` y precio en `sky-deep`; `TourSearch` botón en `sky-deep` con hover `sky`; `ScrollToTop` hover `sky`; botón del estado vacío hover `sky`; `Footer` fondo `bg-black` con títulos, iconos y redes en `sky`.
3. Hero, overlays, CTA y cabecera de `/tours` heredan el cambio vía tokens (oscuros → negro, CTA → azul profundo). Sin dark mode, sin paleta roja, sin cambios de estructura ni funcionalidad. Logo y fotos intactos.
4. Build de producción verificado. Lint: solo el error pre-existente de `TourCard`.

### 2026-10-23 (11) — paddings uniformes, sidebar móvil glassmorphism y carrito

1. **Paddings uniformes y más chicos**: `ToursSections` popular `py-40` → `pt-36 pb-12 sm:pt-24 sm:pb-16` (el `pt` de móvil despeja el buscador superpuesto), "otras opciones" `pb-20` → `py-12 sm:py-16`, `CtaSection` `py-16 sm:py-20` → `py-12 sm:py-16`, encabezado de `/tours` `py-14 sm:py-20` → `py-12 sm:py-16` (el catálogo ya tenía `py-12 sm:py-16`). `TourSearch` ligeramente más compacto en móvil (`p-3`, `gap-2.5`, campos `py-2`, botón `py-2.5`; sm+ intacto).
2. `components/Header.tsx`: el menú móvil dejó de ser un desplegable instantáneo y ahora es un **sidebar glassmorphism** (`bg-white/70` + `backdrop-blur-2xl` + `backdrop-saturate-150`) que se desliza desde la derecha (300ms) con velo `bg-charcoal/40 backdrop-blur-sm` que se funde. ⚠️ El sidebar vive **FUERA del `<header>`** (hermano, en un fragmento): el `backdrop-filter` del header crea un containing block y los `fixed` de adentro no cubrirían la pantalla. Siempre montado con `inert={!menuOpen}` (React 19) para animar entrada/salida; scroll del body bloqueado mientras está abierto. Nota: el velo está en z-40 y el header en z-50, así el header queda brillante sobre el fondo oscurecido.
3. `components/icons.tsx` + `Header`: icono de **carrito de compras** (`CartIcon`) junto al botón de búsqueda — **temporal, sin funcionalidad** ("solo por ahorita").
4. Build de producción verificado sin errores.

### 2026-10-23 (10) — móvil más compacto: tipografías, footer y flecha arriba

1. **Tipografía móvil un escalón más chica** en todo el sitio: `Hero` (h1 `text-3xl`, párrafo `text-sm`, beneficios `text-xs`, frase manuscrita `text-2xl`), `ToursSections` (h2 `text-2xl`, párrafos `text-xs`, botones `text-xs`), `TourSearch` (campos `text-xs`), `TourCard` (nombre `text-sm`, precio `text-base`), `CtaSection` (h2 `text-xl`, texto `text-xs`), `app/tours/page.tsx` (h1 `text-2xl`) y menú móvil del `Header` (`text-sm`). Desktop (`sm:`/`lg:`) intacto.
2. `components/Footer.tsx`: reestructurado — logo **sin panel blanco** (`h-14 sm:h-20 lg:h-24` con `drop-shadow`; el logo es mayormente claro así que contrasta sobre el fondo oscuro), destinos **junto al logo en móvil** en grid 2×2 (`grid-cols-[auto_1fr]`), se quitó el h3 "Cruz Tours", paddings y textos más chicos (`py-8`, `text-xs`). En `lg` vuelve a 3 columnas (marca / destinos / contacto) con grid placement explícito.
3. Nuevo `components/ScrollToTop.tsx`: flecha fija bottom-right que aparece tras 480px de scroll y sube con `window.scrollTo({ behavior: "smooth" })` (respeta `prefers-reduced-motion`). Montado en `app/layout.tsx` para que esté en todas las páginas. Icono `ArrowUpIcon` agregado en `components/icons.tsx`.
4. ⚠️ `npm run lint` reporta 2 errores **pre-existentes** (`react-hooks/set-state-in-effect` en `Hero.tsx:70` y `TourCard.tsx:25` — no son de esta sesión). Build de producción verificado sin errores.

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

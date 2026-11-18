// Harness v2: store+thunk+adapter+componentes REALES sin react-dom/server
// (mini-renderer SSR propio: ejecuta el codigo real de los componentes).
const path = require("path");
const fs = require("fs");
const { createRequire } = require("module");

const ROOT = "C:\\Users\\daniel\\Desktop\\projects\\dandev\\cruzcontroltours\\website\\cruzcontroltours-nextjs";
const rootRequire = createRequire(path.join(ROOT, "package.json"));
const ts = rootRequire("typescript");
const React = rootRequire("react");
const { Provider } = rootRequire("react-redux");
const { configureStore } = rootRequire("@reduxjs/toolkit");

// --- jsx-runtime propio (react/jsx-runtime puede estar bloqueado) ---
function _jsx(type, props, key) {
  const { children, ...rest } = props || {};
  const cfg = key !== undefined ? { ...rest, key } : rest;
  if (children === undefined) return React.createElement(type, cfg);
  return Array.isArray(children)
    ? React.createElement(type, cfg, ...children)
    : React.createElement(type, cfg, children);
}
const jsxRuntime = { Fragment: React.Fragment, jsx: _jsx, jsxs: _jsx };

// --- Stubs next/* ---
const LinkStub = ({ href, children, ...rest }) =>
  React.createElement("a", { href, ...rest }, children);
const ImageStub = ({ src, alt, ...rest }) =>
  React.createElement("img", { src, alt, ...rest });

// --- Cargador TS/TSX ---
const cache = new Map();
function resolveFile(base) {
  const cands = [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")];
  for (const c of cands) { try { if (fs.statSync(c).isFile()) return c; } catch {} }
  throw new Error("No resuelto: " + base);
}
function loadProject(file) {
  const full = resolveFile(file);
  if (cache.has(full)) return cache.get(full).exports;
  const src = fs.readFileSync(full, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      jsx: full.endsWith(".tsx") ? ts.JsxEmit.ReactJSX : ts.JsxEmit.None,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = { exports: {} };
  cache.set(full, mod);
  const localRequire = (spec) => {
    if (spec === "next/link") return { __esModule: true, default: LinkStub };
    if (spec === "next/image") return { __esModule: true, default: ImageStub };
    if (spec === "react") return React;
    if (spec === "react/jsx-runtime" || spec === "react/jsx-dev-runtime") return jsxRuntime;
    if (spec.startsWith("@/")) return loadProject(path.join(ROOT, spec.slice(2)));
    if (spec.startsWith(".")) return loadProject(path.resolve(path.dirname(full), spec));
    return rootRequire(spec);
  };
  new Function("require", "module", "exports", "__dirname", "__filename", js)(
    localRequire, mod, mod.exports, path.dirname(full), full,
  );
  return mod.exports;
}

// --- Mini-renderer SSR ---
const REACT_PROVIDER = Symbol.for("react.provider");
const REACT_FRAGMENT = Symbol.for("react.fragment");
const internals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  ?? React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
const DISP_KEY = "H" in internals ? "H" : "ReactCurrentDispatcher";
let ctxMap = new Map();
let idCounter = 0;
const dispatcher = {
  useState: (init) => [typeof init === "function" ? init() : init, () => {}],
  useReducer: (_r, init) => [typeof init === "function" ? init() : init, () => {}],
  useMemo: (fn) => fn(),
  useCallback: (fn) => fn,
  useRef: (v) => ({ current: v }),
  useContext: (ctx) => (ctxMap.has(ctx) ? ctxMap.get(ctx) : ctx._currentValue),
  useSyncExternalStore: (_sub, getSnap, getServer) =>
    getServer ? getServer() : getSnap(),
  useEffect: () => {}, useLayoutEffect: () => {}, useInsertionEffect: () => {},
  useDebugValue: () => {}, useDeferredValue: (v) => v,
  useTransition: () => [false, (fn) => fn()],
  useId: () => `mini-${++idCounter}`,
  useMemoCache: (size) => new Array(size),
  use: () => { throw new Error("use() no soportado"); },
  useOptimistic: () => { throw new Error("useOptimistic no soportado"); },
};
const VOID = new Set(["area","base","br","col","embed","hr","img","input","link","meta","source","track","wbr"]);
const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
function attrName(k) {
  if (k === "className") return "class";
  if (k === "htmlFor") return "for";
  if (k === "viewBox" || k === "preserveAspectRatio") return k;
  if (/^(aria|data)-/.test(k)) return k;
  return k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
function renderAttrs(props) {
  let out = "";
  for (const [k, v] of Object.entries(props || {})) {
    if (k === "children" || k === "key" || k === "ref") continue;
    if (v == null || v === false || typeof v === "function") continue;
    if (k === "style" && typeof v === "object") {
      const css = Object.entries(v).map(([p, val]) => `${p.replace(/[A-Z]/g,(m)=>"-"+m.toLowerCase())}:${val}`).join(";");
      out += ` style="${esc(css)}"`; continue;
    }
    if (v === true) { out += ` ${attrName(k)}`; continue; }
    out += ` ${attrName(k)}="${esc(v)}"`;
  }
  return out;
}
function renderNode(node) {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return esc(node);
  if (Array.isArray(node)) return node.map(renderNode).join("");
  const { type, props } = node;
  if (typeof type === "function") {
    const prev = internals[DISP_KEY];
    internals[DISP_KEY] = dispatcher;
    try { return renderNode(type(props)); }
    finally { internals[DISP_KEY] = prev; }
  }
  if (type === REACT_FRAGMENT || type === React.Fragment) return renderNode(props.children);
  if (type && typeof type === "object" && (type.$$typeof === REACT_PROVIDER || type.$$typeof === Symbol.for("react.context"))) {
    const ctx = type.$$typeof === REACT_PROVIDER ? type._context : type;
    const had = ctxMap.has(ctx), prevVal = ctxMap.get(ctx);
    ctxMap.set(ctx, props.value);
    try { return renderNode(props.children); }
    finally { had ? ctxMap.set(ctx, prevVal) : ctxMap.delete(ctx); }
  }
  if (typeof type === "string") {
    const attrs = renderAttrs(props);
    if (VOID.has(type)) return `<${type}${attrs}>`;
    return `<${type}${attrs}>${renderNode(props.children)}</${type}>`;
  }
  throw new Error("Tipo de nodo no soportado: " + String(type && (type.$$typeof || type)));
}
const render = (store, Comp) => {
  ctxMap = new Map(); idCounter = 0;
  return renderNode(React.createElement(Provider, { store }, React.createElement(Comp)));
};

// --- Modulos reales ---
const toursSlice = loadProject(path.join(ROOT, "lib/store/toursSlice"));
const customersSlice = loadProject(path.join(ROOT, "lib/store/customersSlice"));
const adapter = loadProject(path.join(ROOT, "lib/tour-adapters"));
const Popular = loadProject(path.join(ROOT, "components/PopularToursSection")).default;
const Other = loadProject(path.join(ROOT, "components/OtherToursSection")).default;
const { fetchTours } = toursSlice;
const { toCardTour, POPULAR_TOUR_COUNT } = adapter;

function makeStore() {
  return configureStore({
    reducer: { customers: customersSlice.default, tours: toursSlice.default },
  });
}

// --- Datos shape backend (price string) ---
const mk = (id, title, price, durationDays, active) => ({
  id, title, description: `Desc ${id}`, price, durationDays, active,
  createdAt: "2026-11-18T00:00:00.000Z",
});
const okFetch = (data) => async () => ({ status: 200, ok: true, json: async () => ({ data }) });

let pass = 0, fail = 0;
function check(name, cond, extra = "") {
  if (cond) { pass++; console.log(`PASS ${name}`); }
  else { fail++; console.log(`FAIL ${name} ${extra}`); }
}
const count = (html, s) => html.split(s).length - 1;

(async () => {
  // A. LOADING
  let release;
  global.fetch = () => new Promise((res) => { release = () => res({ status: 200, ok: true, json: async () => ({ data: [] }) }); });
  const sA = makeStore();
  const pA = sA.dispatch(fetchTours());
  check("A0 pending real", sA.getState().tours.listStatus === "loading");
  const htmlALoad = render(sA, Popular);
  check("A1 skeleton popular", htmlALoad.includes('aria-busy="true"'));
  check("A2 texto cargando", htmlALoad.includes("Cargando tours"));
  check("A3 skeleton otras", render(sA, Other).includes('aria-busy="true"'));
  release(); await pA;

  // B. SUCCESS 7 (1 inactivo)
  const tours = [
    mk(1, "Ruta de las Flores", "45.00", 1, true),
    mk(2, "Cerro Verde", "40", 1, true),
    mk(3, "Surf El Tunco", "50.50", 1, true),
    mk(4, "Cascadas Juayua", "35", 2, true),
    mk(5, "Suchitoto Colonial", "28", 1, true),
    mk(6, "Volcan Santa Ana", "30", 2, true),
    mk(7, "Tour Fantasma", "99", 1, false),
  ];
  global.fetch = okFetch(tours);
  const sB = makeStore();
  await sB.dispatch(fetchTours());
  check("B0 succeeded", sB.getState().tours.listStatus === "succeeded");
  check("B0b 7 items", sB.getState().tours.items.length === 7);
  check("B0c POPULAR_TOUR_COUNT=5", POPULAR_TOUR_COUNT === 5);
  // adapter directo (real)
  const m = toCardTour(tours[0], true);
  check("B0d adapter shape", m.id === "api-1" && m.name === "Ruta de las Flores" && m.price === 45 && m.duration === "1 día" && m.image === "" && m.popular === true, JSON.stringify(m));
  const m2 = toCardTour(tours[3]);
  check("B0e plural dias", m2.duration === "2 días");
  const htmlB = render(sB, Popular);
  check("B1 5 placeholders", count(htmlB, "Foto próximamente") === 5, `got ${count(htmlB, "Foto próximamente")}`);
  check("B2 nombres populares", ["Ruta de las Flores","Cerro Verde","Surf El Tunco","Cascadas Juayua","Suchitoto Colonial"].every((t) => htmlB.includes(t)));
  check("B3 inactivo excluido", !htmlB.includes("Tour Fantasma"));
  check("B4 sexto fuera populares", !htmlB.includes("Volcan Santa Ana"));
  check("B5 $45", htmlB.includes("$45"));
  check("B6 $50.5", htmlB.includes("$50.5"));
  check("B7 dias", htmlB.includes("1 día") && htmlB.includes("2 días"));
  check("B8 option destino", htmlB.includes('<option value="El Salvador">'));
  const htmlBO = render(sB, Other);
  check("B10 otras 1 card", count(htmlBO, "Foto próximamente") === 1, `got ${count(htmlBO, "Foto próximamente")}`);
  check("B11 otras sexto", htmlBO.includes("Volcan Santa Ana"));
  check("B12 otras sin populares", !htmlBO.includes("Ruta de las Flores"));
  check("B13 otras sin inactivo", !htmlBO.includes("Tour Fantasma"));

  // C. EMPTY
  global.fetch = okFetch([]);
  const sC = makeStore();
  await sC.dispatch(fetchTours());
  check("C1 vacio", render(sC, Popular).includes("Aún no hay tours publicados"));
  check("C2 otras oculta", render(sC, Other) === "");

  // D. ERROR
  global.fetch = async () => { throw new Error("boom"); };
  const sD = makeStore();
  await sD.dispatch(fetchTours());
  check("D0 failed", sD.getState().tours.listStatus === "failed");
  const htmlD = render(sD, Popular);
  check("D1 msg error", htmlD.includes("No pudimos cargar los tours"));
  check("D2 reintentar", htmlD.includes("Reintentar"));
  check("D3 msg conexion", htmlD.includes("No se pudo conectar"));
  check("D4 otras oculta", render(sD, Other) === "");

  // E. RETRY
  global.fetch = okFetch([mk(9, "Tour Reintentado", "10", 1, true)]);
  await sD.dispatch(fetchTours());
  const htmlE = render(sD, Popular);
  check("E1 retry ok", sD.getState().tours.listStatus === "succeeded" && htmlE.includes("Tour Reintentado"));

  // F. multi-frame timing
  const t0 = Date.now();
  for (let i = 0; i < 20; i++) render(sB, Popular);
  const avg = (Date.now() - t0) / 20;
  console.log(`INFO render avg ${avg.toFixed(1)}ms x20`);
  check("F1 avg < 1000ms", avg < 1000, `got ${avg}`);

  console.log(`\nTOTAL pass=${pass} fail=${fail}`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(2); });

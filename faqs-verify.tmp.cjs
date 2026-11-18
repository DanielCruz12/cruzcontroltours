const path = require("path");
const fs = require("fs");
const { createRequire } = require("module");

const ROOT = "C:\\Users\\daniel\\Desktop\\projects\\dandev\\cruzcontroltours\\website\\cruzcontroltours-nextjs";
const rootRequire = createRequire(path.join(ROOT, "package.json"));
const ts = rootRequire("typescript");
const React = rootRequire("react");
const { Provider } = rootRequire("react-redux");
const { configureStore } = rootRequire("@reduxjs/toolkit");

function _jsx(type, props, key) {
  const { children, ...rest } = props || {};
  const cfg = key !== undefined ? { ...rest, key } : rest;
  if (children === undefined) return React.createElement(type, cfg);
  return Array.isArray(children)
    ? React.createElement(type, cfg, ...children)
    : React.createElement(type, cfg, children);
}
const jsxRuntime = { Fragment: React.Fragment, jsx: _jsx, jsxs: _jsx };

const cache = new Map();
function resolveFile(base) {
  for (const c of [`${base}.ts`, `${base}.tsx`]) {
    try { if (fs.statSync(c).isFile()) return c; } catch {}
  }
  throw new Error("Unresolved: " + base);
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

const REACT_PROVIDER = Symbol.for("react.provider");
const internals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  ?? React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
const DISP_KEY = "H" in internals ? "H" : "ReactCurrentDispatcher";
let ctxMap = new Map();
const dispatcher = {
  useState: (init) => [typeof init === "function" ? init() : init, () => {}],
  useReducer: (_r, init) => [typeof init === "function" ? init() : init, () => {}],
  useMemo: (fn) => fn(),
  useCallback: (fn) => fn,
  useRef: (v) => ({ current: v }),
  useContext: (ctx) => (ctxMap.has(ctx) ? ctxMap.get(ctx) : ctx._currentValue),
  useSyncExternalStore: (_sub, getSnap, getServer) => (getServer ? getServer() : getSnap()),
  useEffect: () => {}, useLayoutEffect: () => {}, useInsertionEffect: () => {},
  useDebugValue: () => {}, useDeferredValue: (v) => v,
  useTransition: () => [false, (fn) => fn()],
  useId: () => "mini-1",
  useMemoCache: (size) => new Array(size),
  use: () => { throw new Error("unsupported"); },
  useOptimistic: () => { throw new Error("unsupported"); },
};
const VOID = new Set(["area","base","br","col","embed","hr","img","input","link","meta","source","track","wbr"]);
const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
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
  if (type === Symbol.for("react.fragment") || type === React.Fragment) return renderNode(props.children);
  if (type && typeof type === "object" && (type.$$typeof === REACT_PROVIDER || type.$$typeof === Symbol.for("react.context"))) {
    const ctx = type.$$typeof === REACT_PROVIDER ? type._context : type;
    const had = ctxMap.has(ctx), prevVal = ctxMap.get(ctx);
    ctxMap.set(ctx, props.value);
    try { return renderNode(props.children); }
    finally { had ? ctxMap.set(ctx, prevVal) : ctxMap.delete(ctx); }
  }
  if (typeof type === "string") {
    let attrs = "";
    for (const [k, v] of Object.entries(props || {})) {
      if (k === "children" || k === "key" || k === "ref") continue;
      if (v == null || v === false || typeof v === "function") continue;
      const name = k === "className" ? "class" : k === "htmlFor" ? "for" : k;
      attrs += v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
    }
    if (VOID.has(type)) return `<${type}${attrs}>`;
    return `<${type}${attrs}>${renderNode(props.children)}</${type}>`;
  }
  throw new Error("Unsupported node: " + String(type && (type.$$typeof || type)));
}
const render = (store, Comp) => {
  ctxMap = new Map();
  return renderNode(React.createElement(Provider, { store }, React.createElement(Comp)));
};

const faqsSlice = loadProject(path.join(ROOT, "lib/store/faqsSlice"));
const customersSlice = loadProject(path.join(ROOT, "lib/store/customersSlice"));
const toursSlice = loadProject(path.join(ROOT, "lib/store/toursSlice"));
const FaqSection = loadProject(path.join(ROOT, "components/FaqSection")).default;
const { fetchFaqs } = faqsSlice;

function makeStore() {
  return configureStore({
    reducer: { customers: customersSlice.default, faqs: faqsSlice.default, tours: toursSlice.default },
  });
}
const okFetch = (data) => async () => ({ status: 200, ok: true, json: async () => ({ data }) });

let pass = 0, fail = 0;
function check(name, cond, extra = "") {
  if (cond) { pass++; console.log(`PASS ${name}`); }
  else { fail++; console.log(`FAIL ${name} ${extra}`); }
}

(async () => {
  let release;
  global.fetch = () => new Promise((res) => { release = () => res({ status: 200, ok: true, json: async () => ({ data: [] }) }); });
  const sA = makeStore();
  const pA = sA.dispatch(fetchFaqs());
  const htmlLoad = render(sA, FaqSection);
  check("Q1 loading skeleton", htmlLoad.includes('aria-busy="true"') && htmlLoad.includes("Cargando preguntas"));
  release(); await pA;

  global.fetch = okFetch([
    { id: 1, question: "How do I book?", answer: "Via WhatsApp.", active: true },
    { id: 2, question: "Hidden?", answer: "No.", active: false },
    { id: 3, question: "What is included?", answer: "Transport.", active: true },
  ]);
  const sB = makeStore();
  await sB.dispatch(fetchFaqs());
  const htmlB = render(sB, FaqSection);
  check("Q2 succeeded", sB.getState().faqs.listStatus === "succeeded");
  check("Q3 active shown", htmlB.includes("How do I book?") && htmlB.includes("What is included?"));
  check("Q4 inactive hidden", !htmlB.includes("Hidden?"));
  check("Q5 answers shown", htmlB.includes("Via WhatsApp."));

  global.fetch = okFetch([]);
  const sC = makeStore();
  await sC.dispatch(fetchFaqs());
  check("Q6 empty hides section", render(sC, FaqSection) === "");

  global.fetch = async () => { throw new Error("boom"); };
  const sD = makeStore();
  await sD.dispatch(fetchFaqs());
  const htmlD = render(sD, FaqSection);
  check("Q7 error + retry", htmlD.includes("No pudimos cargar las preguntas") && htmlD.includes("Reintentar"));

  console.log(`\nTOTAL pass=${pass} fail=${fail}`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(2); });

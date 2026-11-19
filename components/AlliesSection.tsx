const ALLIES = [
  { name: "VOLCANA", classes: "text-xl font-extrabold tracking-tight" },
  { name: "Ruta de las Flores", classes: "text-[22px] font-light" },
  { name: "Café Loma Verde", classes: "font-serif text-xl" },
  { name: "TUNCO.SURF", classes: "font-mono text-base" },
  {
    name: "Lago Coatepeque",
    classes: "text-sm font-medium uppercase tracking-[0.25em]",
  },
  { name: "Copal & Co", classes: "text-xl font-bold" },
];

function LogoList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex items-center gap-10 pr-10 sm:gap-16 sm:pr-16 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {ALLIES.map((ally) => (
        <li
          key={ally.name}
          className="flex h-[22px] shrink-0 items-center whitespace-nowrap text-neutral-500 opacity-60 transition-opacity duration-200 hover:opacity-100 sm:h-7"
        >
          <span className={`leading-none ${ally.classes}`}>{ally.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AlliesSection() {
  return (
    <section aria-label="Nuestros aliados" className="bg-white py-8">
      <div
        className="overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max motion-safe:animate-[marquee-x_40s_linear_infinite] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center">
          <LogoList />
          <LogoList hidden />
        </div>
      </div>
    </section>
  );
}

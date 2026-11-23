import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRightIcon } from "./icons";

type BlogCardProps = {
  slug: string;
  category: string;
  title: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Tarjeta de artículo del blog (mismo estilo que la sección del home).
 * `className`/`style` permiten inyectar la animación de aparición cuando
 * se usa dentro de secciones con reveal.
 */
export default function BlogCard({
  slug,
  category,
  title,
  className = "",
  style,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={`group flex flex-col rounded-[24px] border border-[#EDEDED] bg-white p-[22px] ${className}`}
      style={style}
    >
      <p className="text-[13px] text-neutral-500">{category}</p>
      <h3 className="mt-3 line-clamp-3 text-[20px] font-normal leading-[1.3] text-neutral-900 group-hover:underline">
        {title}
      </h3>
      <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-neutral-900">
        Leer artículo
        <ArrowRightIcon className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

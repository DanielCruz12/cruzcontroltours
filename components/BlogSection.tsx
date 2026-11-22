"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG, gridColsClass } from "@/lib/site-config";
import { useReveal } from "@/lib/useReveal";
import { ArrowRightIcon } from "./icons";

type Article = {
  category: string;
  title: string;
};

const ARTICLES: Article[] = [
  {
    category: "Web design",
    title: "How we design landing pages that turn visitors into customers",
  },
  {
    category: "Branding",
    title: "A practical guide to naming your company without the headache",
  },
  {
    category: "Product",
    title: "Design systems that scale: tokens, components and documentation",
  },
  {
    category: "Marketing",
    title: "The launch checklist we use before shipping any campaign",
  },
  {
    category: "AI & workflow",
    title: "Pairing designers with AI: where automation actually helps",
  },
  {
    category: "Web design",
    title: "Typography scales for the modern web, explained simply",
  },
];

const STAGGER_MS = 80;
const REVEAL_MS = 600;
const PAGE_SIZE = SITE_CONFIG.blogPageSize;

export default function BlogSection() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { ref, visible, settled } = useReveal<HTMLDivElement>(
    STAGGER_MS * (PAGE_SIZE - 1) + REVEAL_MS,
  );
  const articles = ARTICLES.slice(0, visibleCount);
  const hasMore = visibleCount < ARTICLES.length;

  return (
    <section aria-labelledby="blog-titulo" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[32px] bg-[#F7F7F7] p-6 sm:p-12">
          {/* Encabezado */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[13px] text-neutral-500">From the blog</p>
              <h2
                id="blog-titulo"
                className="mt-4 text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[56px]"
              >
                Ideas for your next build
              </h2>
            </div>
            <Link
              href="/tours"
              className="shrink-0 text-sm font-medium text-neutral-900 hover:underline"
            >
              Explore all articles
            </Link>
          </div>

          {/* Tarjetas */}
          <div
            ref={ref}
            className={`mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 ${gridColsClass(PAGE_SIZE)}`}
          >
            {articles.map((article, index) => (
              <Link
                key={article.title}
                href="/tours"
                className={`group flex flex-col rounded-[24px] border border-[#EDEDED] bg-white p-[22px] motion-safe:transition-all motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:animate-[portfolio-in_300ms_ease-out] ${
                  settled
                    ? "motion-safe:duration-200"
                    : "motion-safe:duration-[600ms]"
                } ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "motion-safe:translate-y-5 motion-safe:opacity-0"
                }`}
                style={{
                  transitionDelay:
                    visible && !settled ? `${index * STAGGER_MS}ms` : "0ms",
                }}
              >
                <p className="text-[13px] text-neutral-500">
                  {article.category}
                </p>
                <h3 className="mt-3 line-clamp-3 text-[20px] font-normal leading-[1.3] text-neutral-900 group-hover:underline">
                  {article.title}
                </h3>
                <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-neutral-900">
                  Read article
                  <ArrowRightIcon className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>

          {ARTICLES.length > PAGE_SIZE && (
            <div className="mt-8 flex justify-center">
              {hasMore ? (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) => count + PAGE_SIZE)
                  }
                  className="btn-negro"
                >
                  Ver más
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setVisibleCount(PAGE_SIZE)}
                  className="btn-negro"
                >
                  Ver menos
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

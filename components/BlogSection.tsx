import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import BlogCard from "./BlogCard";

function CardRow({
  posts,
  hidden = false,
}: {
  posts: BlogPost[];
  hidden?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
      className={`flex shrink-0 items-stretch gap-3 pr-3 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          slug={post.slug}
          category={post.category}
          title={post.title}
          className="w-[280px] shrink-0 sm:w-[330px]"
        />
      ))}
    </div>
  );
}

export default function BlogSection() {
  const posts = getAllPosts();

  return (
    <section aria-labelledby="blog-titulo" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[32px] bg-[#F7F7F7] p-6 sm:p-12">
          {/* Encabezado */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[13px] text-neutral-500">Del blog</p>
              <h2
                id="blog-titulo"
                className="mt-4 text-[44px] font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-[56px]"
              >
                Ideas para tu próxima aventura
              </h2>
            </div>
            <Link
              href="/blog"
              className="shrink-0 text-sm font-medium text-neutral-900 hover:underline"
            >
              Explorar todos los artículos
            </Link>
          </div>

          {/* Tarjetas: carrusel infinito de derecha a izquierda */}
          <div
            className="mt-10 overflow-hidden sm:mt-12"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="flex w-max motion-reduce:w-auto motion-reduce:flex-wrap motion-safe:animate-[marquee-x_40s_linear_infinite] motion-safe:hover:[animation-play-state:paused] motion-safe:focus-within:[animation-play-state:paused]">
              <CardRow posts={posts} />
              <CardRow posts={posts} hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

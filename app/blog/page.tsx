import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { apiPostSlug, getAllPosts } from "@/lib/blog";
import { listPosts } from "@/lib/api/posts";

export const metadata: Metadata = {
  title: "Blog de viajes por El Salvador — Cruz Control Tours",
  description:
    "Guías, consejos e historias para viajar por El Salvador: volcanes, playas, pueblos coloniales y todo lo que necesitas antes de tu próxima aventura.",
};

type CardPost = {
  key: string;
  slug: string;
  category: string;
  title: string;
  date: string;
};

async function getCardPosts(): Promise<CardPost[]> {
  const local: CardPost[] = getAllPosts().map((post) => ({
    key: post.id,
    slug: post.slug,
    category: post.category,
    title: post.title,
    date: post.publishedAt,
  }));

  // Artículos del panel (si el backend no responde, se muestra el catálogo
  // estático sin romper la página).
  let api: CardPost[] = [];
  try {
    const posts = await listPosts();
    api = posts
      .filter((post) => post.published)
      .map((post) => ({
        key: post.id,
        slug: apiPostSlug(post),
        category: post.category ?? "Blog",
        title: post.title,
        date: post.createdAt,
      }));
  } catch {
    api = [];
  }

  return [...api, ...local].sort((a, b) => b.date.localeCompare(a.date));
}

export default async function BlogPage() {
  const posts = await getCardPosts();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Encabezado de la página (con espacio para el navbar flotante) */}
        <section className="bg-charcoal pb-12 pt-24 sm:pb-16 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="pill-blanco">Cruz Control Tours</p>
            <h1 className="titulo-display mt-4 text-white">
              Historias y guías de viaje
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-base">
              Consejos prácticos, guías de destinos e historias de El
              Salvador para inspirar tu próxima aventura.
            </p>
          </div>
        </section>

        {/* Catálogo */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="mb-6 text-sm font-semibold text-ink-soft">
              <span className="font-extrabold text-primary">
                {posts.length}
              </span>{" "}
              {posts.length === 1 ? "artículo" : "artículos"}
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.key} className="flex">
                  <BlogCard
                    slug={post.slug}
                    category={post.category}
                    title={post.title}
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <CtaSection />
      <Footer />
    </>
  );
}

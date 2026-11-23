import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { getPost, type ApiPost } from "@/lib/api/posts";
import {
  apiPostSlug,
  extractApiPostId,
  formatApiPostDate,
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  readingMinutes,
  readingMinutesFromText,
  sanitizePostHtml,
  type BlogPost,
} from "@/lib/blog";
import { getTourBySlug } from "@/lib/tours";

const WHATSAPP_NUMBER = "50360503161";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

type ResolvedPost =
  | { kind: "local"; post: BlogPost }
  | { kind: "api"; post: ApiPost };

// Primero el catálogo estático; si no está, se intenta con el backend
// (sus slugs tienen la forma `titulo-del-articulo-<id>`).
async function resolvePost(slug: string): Promise<ResolvedPost | null> {
  const local = getPostBySlug(slug);
  if (local) return { kind: "local", post: local };

  const id = extractApiPostId(slug);
  if (!id) return null;
  try {
    const apiPost = await getPost(id);
    if (!apiPost.published) return null;
    if (apiPostSlug(apiPost) !== slug) return null;
    return { kind: "api", post: apiPost };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolvePost(slug);
  if (!resolved)
    return { title: "Artículo no encontrado — Cruz Control Tours" };
  const title =
    resolved.kind === "local" ? resolved.post.title : resolved.post.title;
  const excerpt =
    resolved.kind === "local"
      ? resolved.post.excerpt
      : (resolved.post.excerpt ?? "Artículo del blog de Cruz Control Tours.");
  return {
    title: `${title} — Cruz Control Tours`,
    description: excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = await resolvePost(slug);
  if (!resolved) notFound();

  const isLocal = resolved.kind === "local";
  const title = resolved.post.title;
  const category = isLocal
    ? resolved.post.category
    : (resolved.post.category ?? "Blog");
  const excerpt = isLocal ? resolved.post.excerpt : resolved.post.excerpt;
  const image = isLocal ? resolved.post.image : resolved.post.coverImage;
  const imageAlt = isLocal
    ? resolved.post.imageAlt
    : `Portada del artículo: ${title}`;
  const date = isLocal
    ? formatPostDate(resolved.post.publishedAt)
    : formatApiPostDate(resolved.post.createdAt);
  const minutes = isLocal
    ? readingMinutes(resolved.post)
    : readingMinutesFromText(
        `${resolved.post.excerpt ?? ""} ${resolved.post.content ?? ""}`,
      );
  const cleanHtml =
    !isLocal && resolved.post.content
      ? sanitizePostHtml(resolved.post.content)
      : null;

  const tourSlug =
    isLocal && resolved.post.relatedTourSlug
      ? resolved.post.relatedTourSlug
      : null;
  const tour = tourSlug ? getTourBySlug(tourSlug) : undefined;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    tour ? `Hola, me interesa el tour: ${tour.name}` : "Hola, quiero planear mi próximo viaje",
  )}`;

  const allLocal = getAllPosts();
  const related = (
    isLocal
      ? [
          ...allLocal.filter(
            (item) =>
              item.id !== resolved.post.id &&
              item.category === resolved.post.category,
          ),
          ...allLocal.filter(
            (item) =>
              item.id !== resolved.post.id &&
              item.category !== resolved.post.category,
          ),
        ]
      : allLocal
  ).slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero con foto */}
        <section className="relative flex min-h-[52svh] items-end overflow-hidden bg-charcoal">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-br from-sky-deep via-sky to-sky-pale"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-charcoal/85 via-charcoal/35 to-charcoal/20"
          />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              ← Todos los artículos
            </Link>
            <p className="mt-6 inline-flex rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold text-neutral-900">
              {category}
            </p>
            <h1 className="titulo-display mt-4 max-w-4xl text-white">{title}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/85 sm:text-base">
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="size-4" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-4" />
                {minutes} {minutes === 1 ? "minuto" : "minutos"} de lectura
              </span>
            </p>
          </div>
        </section>

        {/* Contenido + tarjeta lateral */}
        <section className="bg-surface py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px]">
            <article>
              {excerpt && (
                <p className="text-lg font-medium leading-relaxed text-neutral-900 sm:text-xl">
                  {excerpt}
                </p>
              )}
              {isLocal ? (
                <div className="mt-8 space-y-10">
                  {resolved.post.sections.map((section) => (
                    <div key={section.heading}>
                      <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                        {section.heading}
                      </h2>
                      {section.paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              ) : cleanHtml ? (
                <div
                  className="rich-text-content mt-8"
                  dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
              ) : (
                <p className="mt-8 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Este artículo no tiene contenido todavía.
                </p>
              )}
            </article>

            {/* Tarjeta lateral */}
            <aside className="h-fit rounded-[24px] bg-white p-7 shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-200 lg:sticky lg:top-24">
              {tour ? (
                <>
                  <p className="text-sm text-neutral-500">
                    Vive esta experiencia
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-neutral-900">
                    {tour.name}
                  </p>
                  <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
                    <p>
                      <span className="font-bold text-neutral-900">
                        ${tour.price}
                      </span>{" "}
                      por persona · {tour.duration}
                    </p>
                    <p>{tour.location}</p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-negro mt-6 w-full"
                  >
                    Reservar por WhatsApp
                  </a>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="mt-3 block text-center text-sm font-semibold text-neutral-900 hover:underline"
                  >
                    Ver el tour completo
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-2xl font-extrabold text-neutral-900">
                    Planea tu próximo viaje
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Cuéntanos qué te gustaría conocer y te armamos la
                    experiencia ideal con guías locales.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-negro mt-6 w-full"
                  >
                    Escríbenos por WhatsApp
                  </a>
                  <Link
                    href="/contacto"
                    className="mt-3 block text-center text-sm font-semibold text-neutral-900 hover:underline"
                  >
                    O usa el formulario de contacto
                  </Link>
                </>
              )}
            </aside>
          </div>
        </section>

        {/* Artículos relacionados */}
        {related.length > 0 && (
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="pill-negro">Sigue leyendo</p>
                  <h2 className="titulo-display mt-4 text-neutral-900">
                    También te puede interesar
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 rounded-full border border-neutral-900/30 px-4 py-2 text-xs font-bold text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Ver todos los artículos
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <li key={item.id} className="flex">
                    <BlogCard
                      slug={item.slug}
                      category={item.category}
                      title={item.title}
                      className="w-full"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

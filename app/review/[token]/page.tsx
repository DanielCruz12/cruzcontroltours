import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ReviewSubmitForm from "@/components/ReviewSubmitForm";
import { getPublicForm } from "@/lib/api/review-forms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  try {
    const form = await getPublicForm(token);
    return {
      title: `${form.title} — Cruz Control Tours`,
      description: `Cuéntanos cómo te fue: ${form.title}.`,
    };
  } catch {
    return { title: "Reseña — Cruz Control Tours" };
  }
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const form = await getPublicForm(token).catch(() => null);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col bg-surface">
        <section className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
          {form === null || form.questions.length === 0 ? (
            <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-neutral-200 sm:p-10">
              <p className="text-xl font-bold text-neutral-900">
                Este enlace ya no está disponible
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-neutral-500">
                El formulario no existe o ya no está activo. Si crees que es
                un error, contáctanos y lo revisamos.
              </p>
              <Link
                href="/"
                className="btn-negro mt-6 inline-flex"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-10">
              <p className="inline-flex rounded-full bg-[#E9E9EB] px-4 py-1.5 text-sm text-neutral-600">
                {form.tourTitle}
              </p>
              <h1 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-4xl">
                {form.title}
              </h1>
              <p className="mt-2 text-[15px] text-neutral-500">
                Tómate un minuto: tu opinión nos ayuda muchísimo.
              </p>
              <ReviewSubmitForm token={token} form={form} />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

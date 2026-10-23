import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1701815843414-50779f1c3b78?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title: "Cruz Control Tours — Los mejores tours en El Salvador",
  description:
    "Aventuras únicas, paisajes increíbles y experiencias que se quedan para siempre. Descubre los mejores tours en El Salvador con guías locales expertos.",
  keywords: [
    "tours El Salvador",
    "turismo El Salvador",
    "Ruta de las Flores",
    "Lago de Coatepeque",
    "volcán de Santa Ana",
    "surf El Tunco",
    "Cruz Control Tours",
  ],
  openGraph: {
    title: "Cruz Control Tours — Los mejores tours en El Salvador",
    description:
      "Aventuras únicas, paisajes increíbles y experiencias que se quedan para siempre.",
    type: "website",
    locale: "es_SV",
    siteName: "Cruz Control Tours",
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: "Volcán de Santa Ana, El Salvador",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}

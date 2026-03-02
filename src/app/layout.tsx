import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ekaitzaren Bertsolariak | Poesía, rock y la voz de la tormenta",
  description:
    "Portal artístico y poético. Letras, canciones y libros. Rock, punk-rock y ska-punk. La tormenta como símbolo de resistencia y verdad.",
  keywords: ["poesía", "rock", "punk", "música", "letras", "autor", "compositor"],
  icons: {
    icon: "/ico/favicon.ico",
    shortcut: "/ico/favicon.ico",
    apple: "/ico/logoOriginalCuadrado.png",
  },
  openGraph: {
    title: "Ekaitzaren Bertsolariak",
    description: "La tormenta tiene voz. La palabra tiene fuego.",
    type: "website",
    images: [
      {
        url: "/ico/logoOriginalCuadrado.png",
        width: 512,
        height: 512,
        alt: "Ekaitzaren Bertsolariak - Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ekaitzaren Bertsolariak",
    description: "La tormenta tiene voz. La palabra tiene fuego.",
    images: ["/ico/logoOriginalCuadrado.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="eu">
      <body className="min-h-screen flex flex-col bg-charcoal text-foreground">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

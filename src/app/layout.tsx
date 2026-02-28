import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ekaitzaren Bertsolariak | Poesía, rock y la voz de la tormenta",
  description:
    "Portal artístico y poético. Letras, canciones y libros. Rock, punk-rock y ska-punk. La tormenta como símbolo de resistencia y verdad.",
  keywords: ["poesía", "rock", "punk", "música", "letras", "autor", "compositor"],
  openGraph: {
    title: "Ekaitzaren Bertsolariak",
    description: "La tormenta tiene voz. La palabra tiene fuego.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="eu">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

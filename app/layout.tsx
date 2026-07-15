import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { LightboxProvider } from "@/components/site/lightbox";
import { Analytics } from "@/components/site/analytics";
import { AnalyticsEvents } from "@/components/site/analytics-events";
import { ProductAssistant } from "@/components/site/product-assistant";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RACOR — Ropa Ciclista Custom Hecha en Madrid",
    template: "%s — RACOR",
  },
  description:
    "RACOR. Ropa ciclista personalizada de alto rendimiento, diseñada y producida en Madrid. Colección Sierra de Madrid.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "RACOR",
    title: "RACOR — Ropa Ciclista Custom Hecha en Madrid",
    description:
      "Ropa ciclista personalizada de alto rendimiento, diseñada y producida en Madrid.",
    images: [{ url: "/assets/racor/navafria-1.webp", alt: "Ciclista con equipación RACOR" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/racor/navafria-1.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RACOR",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/racor/logo.png`,
    sameAs: ["https://www.instagram.com/racor.cc/"],
  }).replace(/</g, "\\u003c");

  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationData }}
        />
        <TooltipProvider>
          <LightboxProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ProductAssistant />
            <AnalyticsEvents />
          </LightboxProvider>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}

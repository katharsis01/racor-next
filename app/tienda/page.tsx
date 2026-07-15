import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { ShopGrid } from "@/components/site/shop-grid";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Tienda oficial RACOR: maillots, culottes, camisetas y accesorios de ciclismo. Compra online con envío desde Madrid.",
};

export default function TiendaPage() {
  return (
    <>
      <PageHero
        title="Colección RACOR"
        intro="Prendas y accesorios de la colección oficial RACOR en stock. Compra online con envío desde Madrid. La compra se completa en nuestra tienda segura."
      />

      <div className="space-y-16 md:space-y-24">
        <ShopGrid />
      </div>

      <Reveal className="px-5 py-24 text-center md:py-40">
        <h2 className="mb-8 text-3xl font-bold uppercase md:text-5xl">
          ¿Prefieres una equipación
          <br />a tu medida?
        </h2>
        <Link
          href="/prendas"
          className="inline-block border border-neutral-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Ver prendas custom
        </Link>
      </Reveal>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con RACOR: 653 224 053 · racorcycling@gmail.com · Madrid. Empecemos tu equipación personalizada.",
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ prenda?: string; diseno?: string }>;
}) {
  const { prenda, diseno } = await searchParams;
  const defaultMensaje = prenda
    ? `Me interesa el modelo ${prenda}. ${diseno ? `Diseño elegido: ${diseno}. ` : ""}`
    : undefined;
  return (
    <>
      <PageHero
        kicker="Contacto"
        title={
          <>
            Hablemos de
            <br />
            tu equipación
          </>
        }
        intro="Cuéntanos tu idea y te respondemos con una propuesta. Sin compromiso y sin pedido mínimo."
      />

      <div className="grid grid-cols-1 gap-12 px-5 pb-28 md:grid-cols-2 md:gap-20 md:px-12 lg:px-16">
        <div className="space-y-10">
          <Reveal>
            <div className="border-t border-neutral-900 pt-4">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em]">
                Contacto directo
              </h3>
              <ul className="space-y-2.5 text-[15px] text-neutral-500">
                <li>
                  <a href="tel:+34653224053" className="flex items-center gap-2.5 hover:opacity-60">
                    <Phone className="size-4" /> 653 224 053
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:racorcycling@gmail.com"
                    className="flex items-center gap-2.5 hover:opacity-60"
                  >
                    <Mail className="size-4" /> racorcycling@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/34653224053"
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2.5 hover:opacity-60"
                  >
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="border-t border-neutral-900 pt-4">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em]">
                Dónde estamos
              </h3>
              <p className="flex items-center gap-2.5 text-[15px] text-neutral-500">
                <MapPin className="size-4" /> Madrid ciudad, España
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="border-t border-neutral-900 pt-4">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em]">
                Horario
              </h3>
              <ul className="space-y-2 text-[15px] text-neutral-500">
                <li>Lunes–Viernes · 9:00–14:00</li>
                <li>Lunes–Viernes · 15:00–18:00</li>
                <li>Sábado y domingo · Cerrado</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <div className="border-t border-neutral-900 pt-4">
              <h3 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.1em]">
                Pide tu propuesta
              </h3>
              <ContactForm defaultMensaje={defaultMensaje} />
              <p className="mt-6 text-sm text-neutral-500">
                ¿Dudas con las medidas? Consulta la{" "}
                <Link href="/tallaje" className="underline underline-offset-4 hover:opacity-60">
                  guía de tallas
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";

const EXPLORE = [
  { href: "/prendas", label: "Prendas" },
  { href: "/nosotros#proceso", label: "Cómo trabajamos" },
  { href: "/galeria", label: "Galería" },
  { href: "/videos", label: "Vídeos" },
  { href: "/tallaje", label: "Tallaje" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="bg-neutral-950 px-5 pt-16 text-white md:px-12 lg:px-16">
      <div className="grid grid-cols-1 gap-8 pb-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Image
            src="/assets/racor/logo.png"
            alt="RACOR"
            width={80}
            height={20}
            className="mb-4 brightness-0 invert"
          />
          <p className="text-sm text-white/60">
            Ropa ciclista custom.
            <br />
            Hecha en Madrid.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
            Contacto
          </h4>
          <ul className="space-y-2.5 text-sm text-white/85">
            <li>
              <a href="tel:+34653224053" className="hover:opacity-60">
                653 224 053
              </a>
            </li>
            <li>
              <a href="mailto:racorcycling@gmail.com" className="hover:opacity-60">
                racorcycling@gmail.com
              </a>
            </li>
            <li>Madrid, España</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
            Horario
          </h4>
          <ul className="space-y-2.5 text-sm text-white/85">
            <li>Lun–Vie · 9:00–14:00</li>
            <li>Lun–Vie · 15:00–18:00</li>
            <li>Fin de semana · Cerrado</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
            Explora
          </h4>
          <ul className="space-y-2.5 text-sm text-white/85">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:opacity-60">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 py-5 text-xs text-white/45">
        © 2026 RACOR · Ropa ciclista custom hecha en Madrid
      </div>
    </footer>
  );
}

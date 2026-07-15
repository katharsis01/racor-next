"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/prendas", label: "Prendas" },
  { href: "/tienda", label: "Tienda" },
  { href: "/galeria", label: "Galería" },
  { href: "/instagram", label: "Instagram" },
  { href: "/videos", label: "Vídeos" },
  { href: "/tallaje", label: "Tallaje" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-white shadow-[0_1px_0_rgba(0,0,0,0.08)]" : "bg-transparent"
      )}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 lg:px-16">
        <Link href="/" aria-label="RACOR inicio">
          <Image
            src="/assets/racor/logo.png"
            alt="RACOR"
            width={88}
            height={22}
            priority
            className={cn(!solid && "brightness-0 invert")}
          />
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-5 md:flex lg:gap-8">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-xs font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-55",
                  solid ? "text-neutral-900" : "text-white",
                  pathname === l.href && "opacity-45"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Abrir menú"
            className={cn("md:hidden", solid ? "text-neutral-900" : "text-white")}
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="top" className="h-dvh border-none bg-white">
            <SheetTitle className="sr-only">Menú</SheetTitle>
            <ul className="flex h-full flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium uppercase tracking-[0.14em] text-neutral-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

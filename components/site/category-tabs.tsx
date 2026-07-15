"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/prendas", label: "Todo" },
  { href: "/prendas/categoria/maillots", label: "Maillots" },
  { href: "/prendas/categoria/manga-larga", label: "Manga larga" },
  { href: "/prendas/categoria/termicos", label: "Térmicos" },
  { href: "/prendas/categoria/chaquetas", label: "Chaquetas" },
  { href: "/prendas/categoria/chalecos", label: "Chalecos" },
  { href: "/prendas/categoria/culottes-cortos", label: "Culottes cortos" },
  { href: "/prendas/categoria/culottes-largos", label: "Culottes largos" },
];

export function CategoryTabs() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[54px] z-40 border-y border-neutral-200 bg-white/95 backdrop-blur md:top-[58px]">
      <div className="scrollbar-none flex gap-1 overflow-x-auto px-5 md:px-12 lg:px-16">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors",
                active
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import type { MetadataRoute } from "next";
import { products } from "@/lib/commerce/local";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/nosotros",
  "/prendas",
  "/prendas/categoria/maillots",
  "/prendas/categoria/manga-larga",
  "/prendas/categoria/termicos",
  "/prendas/categoria/chaquetas",
  "/prendas/categoria/chalecos",
  "/prendas/categoria/culottes-cortos",
  "/prendas/categoria/culottes-largos",
  "/tienda",
  "/galeria",
  "/instagram",
  "/videos",
  "/tallaje",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/prendas" ? 0.9 : 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/prendas/${product.handle}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}

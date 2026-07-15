import type { CommerceProvider } from "./types";
import { localProvider } from "./local";

/**
 * Selector de proveedor de commerce.
 *
 * Hoy: catálogo local (sin ecommerce).
 * Mañana: define COMMERCE_PROVIDER=shopify|medusa en .env y añade el
 * proveedor correspondiente aquí. La UI no cambia.
 *
 * - Shopify Headless: implementar con la Storefront API
 *   (SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN en .env).
 * - Medusa: implementar con @medusajs/js-sdk (MEDUSA_BACKEND_URL en .env).
 * - Pagos: Stripe Checkout se integra en la ruta app/api/checkout cuando
 *   exista STRIPE_SECRET_KEY.
 */
export function getCommerce(): CommerceProvider {
  switch (process.env.COMMERCE_PROVIDER) {
    // case "shopify": return shopifyProvider;
    // case "medusa": return medusaProvider;
    default:
      return localProvider;
  }
}

export * from "./types";

import type { GalleryItem, Product } from "./types";

export function productToGalleryItem(p: Product): GalleryItem {
  return { src: p.image.src, caption: `${p.title} · ${p.description}` };
}

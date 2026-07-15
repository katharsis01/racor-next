/**
 * Capa de commerce abstraída.
 * La UI solo conoce estas interfaces; el proveedor real (Shopify Headless,
 * Medusa o el catálogo local actual) se enchufa en lib/commerce/index.ts
 * sin tocar componentes.
 */

export interface Money {
  amount: number;
  currencyCode: "EUR";
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: ProductCategory;
  tag?: "Bestseller" | "Nuevo";
  image: ProductImage;
  /** Sin precio hasta conectar Shopify/Medusa (venta actual: presupuesto custom) */
  price?: Money;
  /** Galería de la ficha de producto. Si falta, se usa [image]. */
  gallery?: ProductImage[];
  /** Párrafos de descripción técnica larga (ficha de producto). */
  longDescription?: string[];
  /** Bullets de características técnicas. */
  features?: string[];
  /** Handles de productos relacionados a mostrar en "Prendas similares". */
  similar?: string[];
  /** Dibujo técnico plano (delante/detrás) para la sección de ficha técnica. */
  techDrawing?: ProductImage;
  /** Leyenda de tejidos de la ficha técnica. */
  fabrics?: { name: string; description: string; swatch: "light" | "medium" | "ribbed" }[];
  /** Atributos destacados (iconos): ligereza, transpirabilidad, aero, durabilidad... */
  attributes?: ("ligero" | "transpirable" | "aero" | "durable" | "termico")[];
  /**
   * Datos de decisión unificados: termómetro de catálogo, comparadores y
   * recomendador derivan todos de aquí para no contradecirse.
   */
  guide?: {
    /** Rango de uso en ºC [mín, máx]. */
    tempRange: [number, number];
    /** true si el rango es estimado a partir de la descripción (pendiente de confirmar con producto). */
    estimatedRange?: boolean;
    /** Puntuaciones 1–5 para la escala visual. */
    scores?: {
      ventilacion?: number;
      aerodinamica?: number;
      durabilidad?: number;
      abrigo?: number;
    };
  };
  /** Información de decisión y mantenimiento mostrada con una estructura común. */
  productDetails?: {
    climate: string;
    fit: string;
    recommendedUse: string;
    construction: string[];
    care: string[];
    fiberCompositionNote?: string;
    sizingNote?: string;
  };
}

export type ProductCategory =
  | "maillots"
  | "manga-larga"
  | "termicos"
  | "chaquetas"
  | "chalecos"
  | "culottes-cortos"
  | "culottes-largos";

export interface GalleryItem {
  src: string;
  caption: string;
}

export interface CommerceProvider {
  getProducts(category?: ProductCategory): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | undefined>;
}

import type { CommerceProvider, Product, ProductCategory } from "./types";

/**
 * Proveedor local: catálogo estático con las fotos reales de RACOR.
 * Se sustituye por el proveedor de Shopify o Medusa cuando haya cuenta.
 */

const P = "/assets/racor";
const CRUZ_VERDE_ASSETS = {
  front:
    "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/45638328-8522-4072-8CCC-79C5C69256FC_1_201_a-71771725-1920w.jpeg",
  detail:
    "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/508FDCA0-0C3E-4321-A4F5-B6E216A9082D_1_105_c-002c6fc0-1920w.jpeg",
  technical:
    "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/cruz+verde-02-1920w.jpg",
} as const;
const WINTER_ASSETS = {
  cotos: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/893412CF-2B9F-4D07-9ED2-96F15390BD3A_1_105_c-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/2774415A-5808-46AD-9C63-401F03B0CAF7_1_201_a-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/manga+larga+termico+cotos-02-1920w.jpg",
  },
  altoDelLeon: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/C4D7E7F2-AE2A-4BC0-A74B-B140A018D6C5_1_105_c-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/F88ABDC6-D73F-4B1E-B400-B43368FD19FA_1_105_c-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/manga+larga+termico+alto+del+leon-02-1920w.jpg",
  },
  navacerrada: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/1EE1077F-E13F-46F4-8581-A6D602072964_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/53BFE41E-7D40-4274-B33A-8308C8D28E26_1_201_a-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/chaqueta+cotos-02-1920w.jpg",
  },
  bolaDelMundo: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/B6F95AD0-FDD7-4A0F-8039-1090FBECD920_1_105_c-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/63E2B5F8-EE3A-4047-B1F2-447510BDB7AD_1_201_a-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/chaqueta+bola+del+mundo-02-1920w.jpg",
  },
} as const;

const ACCESSORY_ASSETS = {
  miraflores: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/B0860DC6-AFD0-4CC8-8A7E-5DCEF74C3081_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/EC9DFA3A-91E4-409C-8A45-DE4337B6AC00_1_105_c-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/chaleco+miraflores-02-1920w.jpg",
  },
  sotoDelReal: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/B9F82E3D-9411-4251-B4AE-FEAF4220742A_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/7E650346-E0D2-413F-A56D-086F30DD8F80_1_201_a-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/chaleco+soto+del+real-02-1920w.jpg",
  },
  escorial: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/6B4DA5A1-B88D-496C-91A8-87E5ADBE37B0_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/13F6C092-1FB0-4CA8-9EB2-2D1BF2727AB1_1_201_a-1920w.jpeg",
  },
  puebla: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/CA9B3A90-5B64-491A-8F9B-59E25249C358_1_201_a-c1e7bc5b-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/Culotte+Puebla-03-1920w.jpg",
  },
  hiruela: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/3D6E57FC-E65F-461F-81A6-15E6E88B8634_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/B4D0523F-FCFF-4D39-A7B1-6C8C075D1B6A_1_201_a-1920w.jpeg",
  },
  cardoso: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/1416F666-DBE6-4E4D-99F6-891F543B550E_1_201_a-1920w.jpg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/7547DE37-96BA-4A8F-A031-A7B270D88D2E_1_201_a+copia-1920w.jpg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/Culotte+Cardos-02-1920w.jpg",
  },
  somosierra: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/2C6A4DC7-1649-4025-86F1-F3D3F66E46D7_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/CA5BF98A-037D-4C30-81C1-D362FAB4A455_1_201_a-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/Culote+Somosierra-02-1920w.jpg",
  },
  rascafria: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/835E24E4-BCD7-486B-904C-AA68028E7F01_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/FCEEC833-2CC8-4FC0-8B9B-D0C4F18ACB25_1_201_a-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/culote+rascafria-03-1920w.jpg",
  },
  lozoyaBuitrago: {
    front:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/2B6226F1-8892-4834-A81F-16B7BAB9C9BA_1_201_a-1920w.jpeg",
    detail:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/D6E75C5F-F008-4A16-B848-AD1C0A678AF6_1_201_a-1920w.jpeg",
    technical:
      "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/culote+lozoya-03-1920w.jpg",
  },
  chamois:
    "https://le-de.cdn-website.com/d2da41e3f40d49a0ab1b487666827263/dms3rep/multi/opt/badana-07-1920w.jpg",
} as const;

const STANDARD_CARE = [
  "Lavar del revés a un máximo de 30 ºC",
  "No usar suavizante, lejía ni secadora",
  "Secar a la sombra y no planchar",
];

const SUBLIMATION_NOTE =
  "En tejidos sublimados, el color puede perder intensidad al estirar y las zonas de contacto con el sillín pueden mostrar desgaste por fricción.";

export const products: Product[] = [
  {
    id: "morcuera-2-0",
    handle: "maillot-morcuera-2-0",
    guide: {
      tempRange: [24, 35],
      estimatedRange: true,
      scores: { ventilacion: 5, aerodinamica: 4, durabilidad: 4 },
    },
    title: "Morcuera 2.0",
    description:
      "Versión mejorada del maillot Morcuera con nuevos tejidos, composición y acabados.",
    category: "maillots",
    tag: "Nuevo",
    image: { src: `${P}/maillot-morcuera-2-0.png`, alt: "Maillot Morcuera 2.0" },
    gallery: [
      { src: `${P}/maillot-morcuera-2-0.png`, alt: "Maillot Morcuera 2.0 — vista lateral" },
      { src: `${P}/morcuera2-detalle.jpeg`, alt: "Maillot Morcuera 2.0 — sobre la bici" },
      { src: `${P}/morcuera2-espalda.png`, alt: "Maillot Morcuera 2.0 — vista trasera" },
    ],
    techDrawing: {
      src: `${P}/morcuera2-flat.jpg`,
      alt: "Maillot Morcuera 2.0 — dibujo técnico delante y detrás",
    },
    fabrics: [
      {
        name: "Tejido ligero",
        description: "Ultratranspirable · 115 grs/m²",
        swatch: "light",
      },
      {
        name: "Tejido resistente aero",
        description: "Ultratranspirable · 130 grs/m²",
        swatch: "medium",
      },
      {
        name: "Tejido canalizado aero",
        description: "Ultratranspirable · 115 grs/m²",
        swatch: "ribbed",
      },
    ],
    attributes: ["ligero", "transpirable", "aero", "durable"],
    productDetails: {
      climate: "Días de mucho sol y calor intenso",
      fit: "Fit entallado, sin costuras laterales",
      recommendedUse: "Rendimiento, entrenamientos exigentes y competición",
      construction: [
        "Tres tejidos técnicos combinados según la zona de la prenda",
        "Paneles ultratranspirables de 115 a 130 g/m²",
        "Mangas canalizadas con corte láser y cintura grip de 5 cm",
      ],
      care: [
        "Lavar del revés a un máximo de 30 ºC",
        "No usar suavizante, lejía ni secadora",
        "Secar a la sombra y no planchar",
        "Cerrar la cremallera antes del lavado",
      ],
      fiberCompositionNote:
        "Los porcentajes exactos de fibra no están publicados todavía; solicítalos con tu propuesta si los necesitas.",
      sizingNote:
        "Tallaje XS–3XL. Es un patrón fit y pegado al cuerpo; usa el recomendador o solicita un kit de tallaje para equipos.",
    },
    longDescription: [
      "Se trata de un maillot con acabado “fit” sin costuras laterales, entallado y con un alto rendimiento en transpirabilidad y ligereza. Las mangas con corte láser están confeccionadas con un tejido ultra fino acanalado para mejorar la circulación del aire y su rendimiento aerodinámico.",
      "La cinta grip de la cintura permite un ajuste preciso sin presiones abdominales sin reducir la sujeción. Fabricado con una combinación de tejidos altamente técnicos, ultraligeros y ultra transpirables, especial para días de mucho sol y muy calurosos.",
    ],
    features: [
      "Cuello italiano",
      "Mangas nuevo tejido canalizado, acabado corte láser",
      "Sin costura en los laterales",
      "Bolsillos reforzados",
      "Cinta grip de 5 cm antideslizante en la cintura",
      "Cremallera oculta",
    ],
    similar: ["maillot-navafria-oficial", "maillot-canencia"],
  },
  {
    id: "morcuera-oficial",
    handle: "maillot-morcuera-oficial",
    guide: {
      tempRange: [22, 32],
      estimatedRange: true,
      scores: { ventilacion: 5, aerodinamica: 3, durabilidad: 3 },
    },
    title: "Morcuera",
    description:
      "Nuestro maillot top ventas y de mejores prestaciones para climas calurosos.",
    category: "maillots",
    tag: "Bestseller",
    image: { src: `${P}/maillot-morcuera-of.jpeg`, alt: "Maillot Morcuera" },
    gallery: [
      { src: `${P}/maillot-morcuera-of.jpeg`, alt: "Maillot Morcuera" },
      { src: `${P}/morcuera.webp`, alt: "Maillot Morcuera sobre la bici" },
    ],
    longDescription: [
      "El maillot más vendido de RACOR. Diseñado para ofrecer las mejores prestaciones en climas calurosos, con tejidos ultraligeros y máxima transpirabilidad sin perder sujeción ni forma tras lavados repetidos.",
    ],
    features: [
      "Tejido ultraligero de alta transpirabilidad",
      "Corte entallado sin arrugas",
      "Bolsillos traseros reforzados",
      "Cremallera oculta",
      "Banda de silicona antideslizante en cintura",
    ],
    similar: ["maillot-morcuera-2-0", "maillot-navafria-oficial"],
  },
  {
    id: "navafria-oficial",
    handle: "maillot-navafria-oficial",
    guide: {
      tempRange: [22, 30],
      estimatedRange: true,
      scores: { ventilacion: 4, aerodinamica: 3, durabilidad: 3 },
    },
    title: "Navafría",
    description:
      "Nuestro segundo maillot en ventas y popularidad, destaca por sus mangas en rejilla que texturizan el estilo del ciclista.",
    category: "maillots",
    image: { src: `${P}/maillot-navafria-of.jpeg`, alt: "Maillot Navafría" },
    gallery: [
      { src: `${P}/maillot-navafria-of.jpeg`, alt: "Maillot Navafría" },
      { src: `${P}/navafria-1.webp`, alt: "Maillot Navafría rojo sobre la bici" },
      { src: `${P}/navafria-2.webp`, alt: "Maillot Navafría celeste sobre la bici" },
    ],
    longDescription: [
      "Nuestro segundo maillot más vendido. Sus mangas en tejido de rejilla texturizan el estilo del ciclista a la vez que mejoran la ventilación en las zonas de mayor generación de calor.",
    ],
    features: [
      "Mangas en tejido de rejilla transpirable",
      "Corte entallado de competición",
      "Bolsillos traseros de carga",
      "Cremallera oculta",
    ],
    similar: ["maillot-morcuera-oficial", "maillot-canencia"],
  },
  {
    id: "canencia",
    handle: "maillot-canencia",
    guide: {
      tempRange: [18, 28],
      estimatedRange: true,
      scores: { ventilacion: 4, aerodinamica: 3, durabilidad: 5 },
    },
    title: "Canencia",
    description:
      "Nuestro maillot con tejidos de mayor gramaje, con más resistencia y durabilidad sin perder calidad de transpiración.",
    category: "maillots",
    image: { src: `${P}/maillot-canencia.jpeg`, alt: "Maillot Canencia" },
    gallery: [{ src: `${P}/maillot-canencia.jpeg`, alt: "Maillot Canencia" }],
    longDescription: [
      "Confeccionado con tejidos de mayor gramaje que el resto de la colección, pensado para quien busca más resistencia y durabilidad frente al uso intensivo sin renunciar a la transpirabilidad.",
    ],
    features: [
      "Tejido de mayor gramaje y durabilidad",
      "Corte entallado",
      "Bolsillos traseros reforzados",
      "Cremallera oculta",
    ],
    similar: ["maillot-morcuera-oficial", "maillot-navafria-oficial"],
  },
  {
    id: "fuenfria",
    handle: "maillot-manga-larga-fuenfria",
    guide: {
      tempRange: [18, 22],
      scores: { ventilacion: 4, durabilidad: 4, abrigo: 1 },
    },
    title: "Fuenfría",
    description:
      "Maillot manga larga fino para días frescos de otoño y primavera. Rango térmico de 18º a 22º C.",
    category: "manga-larga",
    tag: "Nuevo",
    image: { src: `${P}/fuenfria-1.jpeg`, alt: "Maillot Fuenfría manga larga" },
    gallery: [
      { src: `${P}/fuenfria-1.jpeg`, alt: "Maillot Fuenfría — vista general" },
      { src: `${P}/fuenfria-2.jpeg`, alt: "Maillot Fuenfría — detalle" },
      { src: `${P}/fuenfria-3.jpeg`, alt: "Maillot Fuenfría — sobre la bici" },
    ],
    techDrawing: {
      src: `${P}/fuenfria-flat.jpg`,
      alt: "Maillot Fuenfría — dibujo técnico delante y detrás",
    },
    fabrics: [
      {
        name: "Tejido ligero",
        description: "Ultratranspirable · 115 grs/m²",
        swatch: "light",
      },
      {
        name: "Tejido ultra elástico",
        description: "Adaptación a diferentes morfologías",
        swatch: "medium",
      },
    ],
    attributes: ["termico", "transpirable", "durable"],
    productDetails: {
      climate: "Entretiempo suave · 18–22 ºC",
      fit: "Fit muy entallado y ultraelástico",
      recommendedUse: "Otoño, primavera y mañanas frescas",
      construction: [
        "Tejido fino sin rejilla para conservar parte del calor corporal",
        "Paneles ultratranspirables de 115 g/m²",
        "Tejido ultraelástico para adaptarse a distintas morfologías",
        "Cintura con banda de silicona y cremallera oculta",
      ],
      care: [
        "Lavar del revés a un máximo de 30 ºC",
        "No usar suavizante, lejía ni secadora",
        "Secar a la sombra y no planchar",
        "Cerrar la cremallera antes del lavado",
      ],
      fiberCompositionNote:
        "La ficha original describe los tejidos y el gramaje, pero no publica los porcentajes exactos de cada fibra.",
      sizingNote:
        "Tallaje XS–3XL. Su corte es muy entallado; usa el recomendador o solicita un kit de tallaje para equipos.",
    },
    longDescription: [
      "Maillot de manga larga fino, primo hermano del maillot de manga corta Canencia, pero con mangas largas y sin tejidos de rejilla, con objeto de guardar algo de calor corporal para esos días frescos del otoño y la primavera.",
      "Corte “fit” muy ajustado al cuerpo, eliminando arrugas y obteniendo un perfecto entallado. Sus tejidos ultra elásticos permiten una adaptación perfecta a diferentes morfologías, tallas y tipos de ciclistas. Rango térmico óptimo de 18º a 22º C.",
    ],
    features: [
      "Cuello alto tradicional ciclista",
      "Mangas largas terminadas en puños con dobladillo",
      "Laterales diferenciados",
      "Banda de silicona antideslizante en la cintura",
      "Cremallera oculta",
    ],
    similar: ["maillot-manga-larga-cruz-verde"],
  },
  {
    id: "cruz-verde",
    handle: "maillot-manga-larga-cruz-verde",
    guide: {
      tempRange: [15, 20],
      scores: { ventilacion: 3, durabilidad: 4, abrigo: 3 },
    },
    title: "Cruz Verde",
    description:
      "Maillot de entretiempo en lycra semitérmica de 230 g/m² para días frescos de 15 a 20 ºC.",
    category: "manga-larga",
    tag: "Nuevo",
    image: {
      src: CRUZ_VERDE_ASSETS.front,
      alt: "Maillot Cruz Verde de manga larga",
    },
    gallery: [
      {
        src: CRUZ_VERDE_ASSETS.front,
        alt: "Maillot Cruz Verde — vista general",
      },
      {
        src: CRUZ_VERDE_ASSETS.detail,
        alt: "Maillot Cruz Verde — detalle sobre la bici",
      },
    ],
    techDrawing: {
      src: CRUZ_VERDE_ASSETS.technical,
      alt: "Maillot Cruz Verde — dibujo técnico delantero y trasero",
    },
    fabrics: [
      {
        name: "Lycra semitérmica",
        description: "Tejido grueso · 230 g/m² · alto contenido de elastano",
        swatch: "medium",
      },
    ],
    attributes: ["termico", "durable"],
    productDetails: {
      climate: "Entretiempo · 15–20 ºC",
      fit: "Ajustado y elástico, sin bolsas ni arrugas",
      recommendedUse: "Otoño, primavera y días frescos",
      construction: [
        "Lycra gruesa semitérmica de 230 g/m² en toda la prenda",
        "Alto contenido de elastano para mejorar confort y adaptación",
        "Corte optimizado para reducir bolsas y arrugas",
        "Cintura con banda de silicona y cremallera vista",
      ],
      care: [
        "Lavar del revés a un máximo de 30 ºC",
        "No usar suavizante, lejía ni secadora",
        "Secar a la sombra y no planchar",
        "Cerrar la cremallera antes del lavado",
      ],
      fiberCompositionNote:
        "La ficha original indica lycra con alto contenido de elastano, pero no publica los porcentajes exactos de fibra.",
      sizingNote:
        "Tallaje XS–3XL. Su corte es ajustado y elástico; usa el recomendador o solicita un kit de tallaje para equipos.",
    },
    longDescription: [
      "Un maillot de entretiempo pensado para cubrir el espacio entre las prendas de verano y las de invierno. Su rango recomendado de 15 a 20 ºC lo orienta a jornadas frescas en las que Fuenfría puede resultar demasiado ligero.",
      "Está confeccionado íntegramente con lycra gruesa semitérmica de 230 g/m². El alto contenido de elastano aporta confort y un ajuste preciso, mientras que el corte optimizado ayuda a reducir bolsas y arrugas.",
    ],
    features: [
      "Cuello alto tradicional ciclista",
      "Mangas largas terminadas en puños con dobladillo",
      "Laterales diferenciados",
      "Banda de silicona antideslizante en la cintura",
      "Cremallera vista",
    ],
    similar: ["maillot-manga-larga-fuenfria"],
  },
  {
    id: "altodelleon",
    handle: "maillot-manga-larga-termico-alto-del-leon",
    guide: {
      tempRange: [8, 16],
      scores: { ventilacion: 4, abrigo: 4 },
    },
    title: "Alto del León",
    description:
      "Maillot térmico de alta gama para clima seco, con patrón fit y rango óptimo de 8 a 16 ºC.",
    category: "termicos",
    image: {
      src: WINTER_ASSETS.altoDelLeon.front,
      alt: "Maillot térmico Alto del León",
    },
    gallery: [
      {
        src: WINTER_ASSETS.altoDelLeon.front,
        alt: "Maillot térmico Alto del León — vista general",
      },
      {
        src: WINTER_ASSETS.altoDelLeon.detail,
        alt: "Maillot térmico Alto del León — detalle sobre la bici",
      },
    ],
    techDrawing: {
      src: WINTER_ASSETS.altoDelLeon.technical,
      alt: "Maillot térmico Alto del León — dibujo técnico delantero y trasero",
    },
    fabrics: [
      {
        name: "Full Black / Full Dark Blue",
        description: "Tejido térmico perchado · elástico y transpirable",
        swatch: "medium",
      },
    ],
    attributes: ["termico", "transpirable", "aero"],
    productDetails: {
      climate: "Invierno seco · 8–16 ºC",
      fit: "Fit muy ajustado y aerodinámico",
      recommendedUse: "Rendimiento invernal en clima seco",
      construction: [
        "Tejido Full Black o Full Dark Blue, perchado en el interior",
        "Propiedades termorreguladoras y alta transpirabilidad sin membrana",
        "Paneles laterales integrados sin costuras para reducir arrugas",
        "Personalización limitada a logotipos y rotulaciones Direct Transfer",
      ],
      care: [
        "Lavar del revés a un máximo de 30 ºC",
        "No usar suavizante, lejía ni secadora",
        "Secar a la sombra y no planchar",
        "Cerrar la cremallera antes del lavado",
      ],
      fiberCompositionNote:
        "La ficha original no publica porcentajes de fibra ni una membrana impermeable; el tejido es permeable y no está recomendado para lluvia.",
      sizingNote:
        "Tallaje XS–3XL. El patrón es muy ajustado; usa el recomendador o solicita un kit de tallaje para equipos.",
    },
    longDescription: [
      "Maillot térmico de alta gama, muy elástico y ajustado, con interior perchado y propiedades termorreguladoras. El patrón fit optimizado y los laterales integrados sin costuras buscan eliminar arrugas y mejorar la aerodinámica.",
      "Su rango óptimo es de 8 a 16 ºC en clima seco. La personalización se realiza sobre base Full Black o Full Dark Blue mediante logotipos y rotulaciones Direct Transfer.",
    ],
    features: [
      "Cuello alto tradicional ciclista",
      "Tejido Full Black o Full Dark Blue perchado",
      "Tejido permeable y no apropiado para lluvia",
      "Cintura con banda de silicona antideslizante",
      "Cremallera vista",
    ],
    similar: ["maillot-manga-larga-termico-cotos"],
  },
  {
    id: "cotos",
    handle: "maillot-manga-larga-termico-cotos",
    guide: {
      tempRange: [10, 18],
      scores: { ventilacion: 5, abrigo: 3 },
    },
    title: "Cotos",
    description:
      "Maillot térmico transpirable con interior perchado para clima seco y fresco de 10 a 18 ºC.",
    category: "termicos",
    image: {
      src: WINTER_ASSETS.cotos.front,
      alt: "Maillot térmico Cotos",
    },
    gallery: [
      {
        src: WINTER_ASSETS.cotos.front,
        alt: "Maillot térmico Cotos — vista general",
      },
      {
        src: WINTER_ASSETS.cotos.detail,
        alt: "Maillot térmico Cotos — detalle sobre la bici",
      },
    ],
    techDrawing: {
      src: WINTER_ASSETS.cotos.technical,
      alt: "Maillot térmico Cotos — dibujo técnico delantero y trasero",
    },
    fabrics: [
      {
        name: "Térmico perchado",
        description: "Suave · elástico · altamente transpirable",
        swatch: "ribbed",
      },
    ],
    attributes: ["termico", "transpirable", "durable"],
    productDetails: {
      climate: "Clima seco y fresco · 10–18 ºC",
      fit: "Elástico y confortable",
      recommendedUse: "Otoño, primavera y salidas ventiladas",
      construction: [
        "Pecho, espalda y laterales en tejido térmico perchado",
        "Material muy elástico, confortable y termorregulador",
        "Alta transpirabilidad sin membrana cortaviento",
        "Cintura con silicona, cremallera vista y detalle reflectante",
      ],
      care: [
        "Lavar del revés a un máximo de 30 ºC",
        "No usar suavizante, lejía ni secadora",
        "Secar a la sombra y no planchar",
        "Cerrar la cremallera antes del lavado",
      ],
      fiberCompositionNote:
        "La ficha original no publica porcentajes de fibra ni una membrana impermeable; el tejido es permeable y no está recomendado para lluvia.",
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje antes de producir una equipación de equipo.",
    },
    longDescription: [
      "Maillot de manga larga con tejido térmico suave, elástico y perchado en el interior. Sus propiedades termorreguladoras y su alta transpirabilidad ofrecen protección sin recurrir a una membrana cortaviento.",
      "Está pensado para otoño y primavera, especialmente en clima seco y fresco, con un rango óptimo de 10 a 18 ºC. Es una prenda ventilada y no apropiada para lluvia.",
    ],
    features: [
      "Cuello alto tradicional ciclista",
      "Tejido térmico perchado en pecho, espalda y laterales",
      "Tejido permeable y no apropiado para lluvia",
      "Cintura con banda de silicona antideslizante",
      "Cremallera vista",
      "Detalle reflectante bajo el bolsillo",
    ],
    similar: ["maillot-manga-larga-termico-alto-del-leon"],
  },
  {
    id: "navacerrada",
    handle: "chaqueta-navacerrada",
    guide: {
      tempRange: [8, 16],
      scores: { ventilacion: 4, abrigo: 4 },
    },
    title: "Chaqueta Navacerrada",
    description:
      "Chaqueta térmica perchada y muy transpirable para clima seco, con rango óptimo de 8 a 16 ºC.",
    category: "chaquetas",
    image: {
      src: WINTER_ASSETS.navacerrada.front,
      alt: "Chaqueta térmica Navacerrada",
    },
    gallery: [
      {
        src: WINTER_ASSETS.navacerrada.front,
        alt: "Chaqueta Navacerrada — vista general",
      },
      {
        src: WINTER_ASSETS.navacerrada.detail,
        alt: "Chaqueta Navacerrada — detalle sobre la bici",
      },
    ],
    techDrawing: {
      src: WINTER_ASSETS.navacerrada.technical,
      alt: "Chaqueta Navacerrada — dibujo técnico delantero y trasero",
    },
    fabrics: [
      {
        name: "Térmico perchado",
        description: "Suave · elástico · sin membrana cortaviento",
        swatch: "ribbed",
      },
    ],
    attributes: ["termico", "transpirable", "durable"],
    productDetails: {
      climate: "Invierno seco · 8–16 ºC",
      fit: "Ajuste elástico y confortable",
      recommendedUse: "Ciclistas calurosos y salidas secas",
      construction: [
        "Pecho, espalda y laterales en tejido térmico perchado",
        "Material muy elástico con propiedades termorreguladoras",
        "Alta transpirabilidad sin membrana cortaviento",
        "Cintura con silicona, cremallera vista y detalle reflectante",
      ],
      care: [
        "Lavar del revés a un máximo de 30 ºC",
        "No usar suavizante, lejía ni secadora",
        "Secar a la sombra y no planchar",
        "Cerrar la cremallera antes del lavado",
      ],
      fiberCompositionNote:
        "La ficha original no publica porcentajes de fibra. El tejido es permeable, no incorpora membrana cortaviento y no está recomendado para lluvia.",
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje para equipos antes de confirmar la producción.",
    },
    longDescription: [
      "Chaqueta de alta gama con interior suave y perchado, propiedades termorreguladoras y alta transpirabilidad. Está pensada para ciclistas calurosos que quieren protección frente al frío sin perder ventilación.",
      "Su rango óptimo es de 8 a 16 ºC en clima seco. No incorpora membrana cortaviento y su tejido permeable no está recomendado para lluvia.",
    ],
    features: [
      "Cuello alto tradicional ciclista",
      "Tejido térmico perchado en pecho, espalda y laterales",
      "Tejido permeable y no apropiado para lluvia",
      "Cintura con banda de silicona antideslizante",
      "Cremallera vista",
      "Detalle reflectante bajo el bolsillo",
    ],
    similar: ["chaqueta-bola-del-mundo"],
  },
  {
    id: "boladelmundo",
    handle: "chaqueta-bola-del-mundo",
    guide: {
      tempRange: [0, 15],
      scores: { ventilacion: 2, abrigo: 5 },
    },
    title: "Chaqueta Bola del Mundo",
    description:
      "Chaqueta softshell de doble capa, hidrófuga y cortaviento, para temperaturas inferiores a 0 hasta 15 ºC.",
    category: "chaquetas",
    tag: "Nuevo",
    image: {
      src: WINTER_ASSETS.bolaDelMundo.front,
      alt: "Chaqueta Bola del Mundo",
    },
    gallery: [
      {
        src: WINTER_ASSETS.bolaDelMundo.front,
        alt: "Chaqueta Bola del Mundo — vista general",
      },
      {
        src: WINTER_ASSETS.bolaDelMundo.detail,
        alt: "Chaqueta Bola del Mundo — detalle sobre la bici",
      },
    ],
    techDrawing: {
      src: WINTER_ASSETS.bolaDelMundo.technical,
      alt: "Chaqueta Bola del Mundo — dibujo técnico delantero y trasero",
    },
    fabrics: [
      {
        name: "Softshell de doble capa",
        description: "Hidrófugo · cortaviento · secado rápido",
        swatch: "medium",
      },
      {
        name: "Térmico transpirable",
        description: "Interior de brazos y axilas",
        swatch: "ribbed",
      },
    ],
    attributes: ["termico", "transpirable", "durable"],
    productDetails: {
      climate: "Frío, viento y lluvia · <0–15 ºC",
      fit: "Ajuste protector de invierno",
      recommendedUse: "Invierno húmedo y temperaturas bajas",
      construction: [
        "Softshell de doble capa en pecho, espalda y laterales bajos",
        "Resistencia al aire y al agua con secado rápido",
        "Tejido térmico transpirable en interior de brazos y axilas",
        "Bolsillos con drenaje y cremallera vista con solapa interior",
      ],
      care: [
        "Lavar del revés a un máximo de 30 ºC",
        "No usar suavizante, lejía ni secadora",
        "Secar a la sombra y no planchar",
        "Cerrar la cremallera antes del lavado",
      ],
      fiberCompositionNote:
        "La ficha original describe un tejido softshell hidrófugo, pero no publica porcentajes de fibra ni una clasificación impermeable certificada.",
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje para equipos antes de confirmar la producción.",
    },
    longDescription: [
      "La chaqueta más polivalente para el invierno de RACOR. Su softshell de doble capa aísla frente a temperaturas bajas, evacua la humedad y ofrece resistencia al viento y al agua sin efecto esponja.",
      "Funciona desde temperaturas inferiores a 0 hasta 15 ºC. Los paneles térmicos de brazos y axilas mantienen la transpiración, mientras que los bolsillos incorporan drenaje para días lluviosos.",
    ],
    features: [
      "Cuello alto tradicional ciclista",
      "Softshell de doble capa resistente al aire y al agua",
      "Interior de brazos y axilas en tejido térmico transpirable",
      "Bolsillos con sistema de drenaje",
      "Cintura con banda de silicona antideslizante",
      "Cremallera vista con solapa interior",
      "Detalle reflectante bajo el bolsillo",
    ],
    similar: ["chaqueta-navacerrada"],
  },
  {
    id: "chaleco-miraflores",
    handle: "chaleco-miraflores",
    title: "Miraflores",
    description: "Chaleco cortavientos Serie I, ligero y muy plegable",
    category: "chalecos",
    image: {
      src: ACCESSORY_ASSETS.miraflores.front,
      alt: "Chaleco Miraflores personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.miraflores.front,
        alt: "Chaleco Miraflores personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.miraflores.detail,
        alt: "Chaleco Miraflores personalizado — detalle sobre la bici",
      },
    ],
    techDrawing: {
      src: ACCESSORY_ASSETS.miraflores.technical,
      alt: "Chaleco Miraflores — dibujo técnico delantero y trasero",
    },
    fabrics: [
      {
        name: "Frontal cortavientos",
        description: "Resistente al viento y a la humedad",
        swatch: "medium",
      },
      {
        name: "Espalda elástica",
        description: "Perforada y muy transpirable",
        swatch: "ribbed",
      },
    ],
    attributes: ["ligero", "transpirable"],
    productDetails: {
      climate: "Viento, humedad ligera y descensos · rango no publicado",
      fit: "Ajustado, elástico y de poco volumen",
      recommendedUse: "Descensos, mañanas frescas y cambios de tiempo",
      construction: [
        "Frontal cortavientos resistente a la humedad",
        "Espalda y laterales de malla elástica ultratranspirable",
        "Cremallera bidireccional y abertura para acceder a los bolsillos del maillot",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote: "Composición publicada: 100% poliéster.",
      sizingNote:
        "Tallaje XS–3XL. Consulta el recomendador o solicita un kit de tallaje para equipos.",
    },
    longDescription: [
      "El Miraflores combina un frontal que bloquea viento y humedad con una espalda perforada, elástica y muy ventilada. Su construcción fina permite guardarlo en el bolsillo del maillot cuando deja de hacer falta.",
      "La cremallera bidireccional se puede accionar con una mano y la abertura trasera mantiene accesibles los bolsillos del maillot.",
    ],
    features: [
      "Cuello alto tradicional",
      "Frontal cortavientos resistente al agua",
      "Espalda y laterales de malla elástica ultratranspirable",
      "Abertura para los bolsillos del maillot",
      "Cintura y sisas rematadas con ribete",
      "Cremallera vista bidireccional",
    ],
    similar: ["chaleco-soto-del-real", "chaleco-escorial"],
  },
  {
    id: "chaleco-soto-del-real",
    handle: "chaleco-soto-del-real",
    title: "Soto del Real",
    description: "Chaleco cortavientos Serie II, fino y muy ventilado",
    category: "chalecos",
    image: {
      src: ACCESSORY_ASSETS.sotoDelReal.front,
      alt: "Chaleco Soto del Real personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.sotoDelReal.front,
        alt: "Chaleco Soto del Real personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.sotoDelReal.detail,
        alt: "Chaleco Soto del Real personalizado — detalle sobre la bici",
      },
    ],
    techDrawing: {
      src: ACCESSORY_ASSETS.sotoDelReal.technical,
      alt: "Chaleco Soto del Real — dibujo técnico delantero y trasero",
    },
    fabrics: [
      {
        name: "Cortavientos Serie II",
        description: "Frontal de menor gramaje",
        swatch: "light",
      },
      {
        name: "Malla elástica",
        description: "Espalda y laterales ultratranspirables",
        swatch: "ribbed",
      },
    ],
    attributes: ["ligero", "transpirable"],
    productDetails: {
      climate: "Viento y descensos · rango no publicado",
      fit: "Ajustado y muy plegable",
      recommendedUse: "Protección ligera con el mínimo volumen",
      construction: [
        "Frontal cortavientos Serie II de menor gramaje y aislamiento que Miraflores",
        "Espalda y laterales de malla elástica ultratranspirable",
        "Cremallera bidireccional y abertura para los bolsillos del maillot",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote:
        "La ficha original no publica los porcentajes exactos de fibra.",
      sizingNote:
        "Tallaje XS–3XL. Consulta el recomendador o solicita un kit de tallaje para equipos.",
    },
    longDescription: [
      "El Soto del Real es la alternativa más ligera al Miraflores. Su frontal cortavientos Serie II emplea un tejido de menor gramaje, por lo que ofrece menos aislamiento pero conserva la protección necesaria para descensos y días frescos.",
      "La espalda de malla elástica favorece la ventilación y su poco volumen permite guardarlo fácilmente en el maillot.",
    ],
    features: [
      "Cuello alto tradicional",
      "Frontal cortavientos Serie II",
      "Espalda y laterales de malla elástica ultratranspirable",
      "Abertura para los bolsillos del maillot",
      "Cintura y sisas rematadas con ribete",
      "Cremallera vista bidireccional",
    ],
    similar: ["chaleco-miraflores", "chaleco-escorial"],
  },
  {
    id: "chaleco-escorial",
    handle: "chaleco-escorial",
    title: "Escorial",
    description: "Chaleco térmico de softshell para frío, viento y humedad",
    category: "chalecos",
    image: {
      src: ACCESSORY_ASSETS.escorial.front,
      alt: "Chaleco térmico Escorial personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.escorial.front,
        alt: "Chaleco térmico Escorial personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.escorial.detail,
        alt: "Chaleco térmico Escorial personalizado — detalle sobre la bici",
      },
    ],
    fabrics: [
      {
        name: "Softshell de doble capa",
        description: "Frontal cortavientos e hidrófugo",
        swatch: "medium",
      },
      {
        name: "Térmico perchado",
        description: "Espalda y laterales transpirables",
        swatch: "ribbed",
      },
    ],
    attributes: ["termico", "transpirable", "durable"],
    productDetails: {
      climate: "Frío, viento y humedad · 0–16 ºC",
      fit: "Entallado, elástico y cómodo",
      recommendedUse: "Entrenamientos fríos que requieren abrigo en el torso",
      construction: [
        "Pecho con membrana softshell de doble capa, cortavientos e hidrófuga",
        "Espalda y laterales en tejido térmico perchado y transpirable",
        "Tres bolsillos traseros y cremallera vista con solapa interior",
      ],
      care: [...STANDARD_CARE, "Cerrar la cremallera antes del lavado"],
      fiberCompositionNote:
        "La ficha original describe las capas técnicas, pero no publica porcentajes exactos de fibra.",
      sizingNote:
        "Tallaje XS–3XL. Consulta el recomendador o solicita un kit de tallaje para equipos.",
    },
    longDescription: [
      "El Escorial es el chaleco más protector de la colección. Incorpora softshell de doble capa en el pecho para aislar frente al viento y la humedad, combinado con tejido térmico perchado y transpirable en espalda y laterales.",
      "Su rango publicado es de 0 a 16 ºC y añade tres bolsillos traseros para funcionar como una prenda exterior completa.",
    ],
    features: [
      "Cuello alto tradicional",
      "Pecho con membrana softshell cortavientos e hidrófuga",
      "Espalda y laterales térmicos, perchados y transpirables",
      "Tres bolsillos traseros independientes",
      "Cintura con banda de silicona antideslizante",
      "Cremallera vista con solapa interior",
    ],
    similar: ["chaleco-miraflores", "chaleco-soto-del-real"],
  },
  {
    id: "culotte-puebla",
    handle: "culotte-puebla",
    title: "Puebla",
    description: "Culotte corto de color sólido con tres acabados de pierna",
    category: "culottes-cortos",
    image: {
      src: ACCESSORY_ASSETS.puebla.front,
      alt: "Culotte corto Puebla personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.puebla.front,
        alt: "Culotte corto Puebla personalizado — vista general",
      },
    ],
    techDrawing: {
      src: ACCESSORY_ASSETS.puebla.technical,
      alt: "Culotte Puebla — opciones de acabado",
    },
    attributes: ["durable"],
    productDetails: {
      climate: "Tiempo templado y cálido · rango no publicado",
      fit: "Ergonómico, optimizado y compresivo",
      recommendedUse: "Equipaciones que priorizan color sólido y estabilidad visual",
      construction: [
        "Base de tinta sólida Full Black o Full Dark Blue",
        "Logotipos y rotulaciones mediante Direct Transfer",
        "Tres acabados: Total Grip, Grip Black o Grip sublimado de 8 cm",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote:
        "La ficha original no publica los porcentajes exactos de fibra. " + SUBLIMATION_NOTE,
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje antes de producir.",
    },
    longDescription: [
      "Puebla es el culotte corto de gama alta para quien busca una base de color sólido que mantenga la intensidad al estirar. Los logotipos se aplican mediante Direct Transfer sobre negro o azul oscuro.",
      "Se puede elegir entre Total Grip con antideslizante integrado, Grip Black con banda sólida de 8 cm o Grip sublimado para personalizar esa banda a todo color.",
    ],
    features: [
      "Base Full Black o Full Dark Blue",
      "Logotipos mediante Direct Transfer",
      "Total Grip con banda antideslizante integrada",
      "Grip Black de 8 cm en negro sólido",
      "Grip sublimado de 8 cm personalizable",
    ],
    similar: ["culotte-hiruela", "culotte-cardoso", "culotte-somosierra"],
  },
  {
    id: "culotte-hiruela",
    handle: "culotte-hiruela",
    title: "Hiruela",
    description: "Culotte corto sublimado con zonas de contacto en color sólido",
    category: "culottes-cortos",
    image: {
      src: ACCESSORY_ASSETS.hiruela.front,
      alt: "Culotte corto Hiruela personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.hiruela.front,
        alt: "Culotte corto Hiruela personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.hiruela.detail,
        alt: "Culotte corto Hiruela personalizado — detalle",
      },
      {
        src: ACCESSORY_ASSETS.chamois,
        alt: "Detalle de badana mostrado en la ficha original del culotte Hiruela",
      },
    ],
    attributes: ["durable", "transpirable"],
    productDetails: {
      climate: "Tiempo templado y cálido · rango no publicado",
      fit: "Ergonómico, optimizado y compresivo",
      recommendedUse: "Personalización amplia conservando sólidas las zonas de roce",
      construction: [
        "Paneles de contacto con el sillín en negro o azul oscuro sólido",
        "Grip, laterales y parte trasera personalizables según acabado",
        "Acabados Hiruela Grip, Hiruela Lateral e Hiruela Total Grip",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote:
        "La ficha original no publica los porcentajes exactos de fibra. " + SUBLIMATION_NOTE,
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje antes de producir.",
    },
    longDescription: [
      "Hiruela conserva el patrón ergonómico y compresivo de Puebla, pero amplía la personalización por sublimación. Las zonas que apoyan sobre el sillín permanecen en tejido de tinta sólida para limitar el desgaste visual por fricción.",
      "Los acabados permiten personalizar la banda de 8 cm, los laterales y la parte trasera en diferentes combinaciones.",
    ],
    features: [
      "Hiruela Grip: banda de 8 cm sublimada",
      "Hiruela Lateral: lateral, trasera y grip sublimados",
      "Hiruela Total Grip: laterales y trasera sublimados",
      "Zonas de fricción en tejido sólido negro o azul oscuro",
    ],
    similar: ["culotte-puebla", "culotte-cardoso", "culotte-somosierra"],
  },
  {
    id: "culotte-cardoso",
    handle: "culotte-cardoso",
    title: "Cardoso",
    description: "Culotte corto totalmente sublimado para libertad de diseño",
    category: "culottes-cortos",
    image: {
      src: ACCESSORY_ASSETS.cardoso.front,
      alt: "Culotte corto Cardoso personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.cardoso.front,
        alt: "Culotte corto Cardoso personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.cardoso.detail,
        alt: "Culotte corto Cardoso personalizado — detalle",
      },
      {
        src: ACCESSORY_ASSETS.chamois,
        alt: "Detalle de badana mostrado en la ficha original del culotte Cardoso",
      },
    ],
    techDrawing: {
      src: ACCESSORY_ASSETS.cardoso.technical,
      alt: "Culotte Cardoso — opciones de acabado",
    },
    attributes: ["transpirable"],
    productDetails: {
      climate: "Tiempo templado y cálido · rango no publicado",
      fit: "Ergonómico, optimizado y compresivo",
      recommendedUse: "Diseños a todo color sin paneles sólidos",
      construction: [
        "Todos los paneles se personalizan por sublimación",
        "Incluye laterales, parte trasera, interior y grip",
        "Acabados Cardoso Grip de 8 cm o Cardoso Total Grip",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote:
        "La ficha original no publica los porcentajes exactos de fibra. " + SUBLIMATION_NOTE,
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje antes de producir.",
    },
    longDescription: [
      "Cardoso parte del concepto Hiruela y lleva la personalización al máximo: todos sus paneles, incluidos laterales, trasera, interior y grip, se subliman a todo color.",
      "Es la opción para diseños que necesitan continuidad visual total. Como en cualquier tejido sublimado elástico, los tonos oscuros pueden aclararse al estirar y las zonas de roce pueden desgastarse.",
    ],
    features: [
      "Personalización integral por sublimación",
      "Cardoso Grip con banda de 8 cm",
      "Cardoso Total Grip",
      "Laterales, trasera e interior personalizables",
    ],
    similar: ["culotte-hiruela", "culotte-puebla", "culotte-somosierra"],
  },
  {
    id: "culotte-somosierra",
    handle: "culotte-somosierra",
    title: "Somosierra",
    description: "Culotte cargo con bolsillos en piernas y zona lumbar",
    category: "culottes-cortos",
    tag: "Nuevo",
    image: {
      src: ACCESSORY_ASSETS.somosierra.front,
      alt: "Culotte cargo Somosierra personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.somosierra.front,
        alt: "Culotte cargo Somosierra personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.somosierra.detail,
        alt: "Culotte cargo Somosierra personalizado — detalle de bolsillo",
      },
      {
        src: ACCESSORY_ASSETS.chamois,
        alt: "Detalle de badana mostrado en la ficha original del culotte Somosierra",
      },
    ],
    techDrawing: {
      src: ACCESSORY_ASSETS.somosierra.technical,
      alt: "Culotte cargo Somosierra — dibujo técnico",
    },
    attributes: ["durable"],
    productDetails: {
      climate: "Tiempo templado y cálido · rango no publicado",
      fit: "Técnico con almacenamiento integrado",
      recommendedUse: "Gravel, cicloturismo, bikepacking y rutas largas",
      construction: [
        "Bolsillos amplios y accesibles en ambas piernas",
        "Dos bolsillos adicionales en la zona lumbar",
        "Pensado para usar también con camisetas o maillots sin bolsillos",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote:
        "La ficha original no publica los porcentajes exactos de fibra. " + SUBLIMATION_NOTE,
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje antes de producir.",
    },
    longDescription: [
      "Somosierra es el culotte cargo de la colección, pensado para viajes en bici, aventuras cicloturistas y gravel. Añade capacidad de carga sin depender de los bolsillos de un maillot.",
      "Cuenta con bolsillos de fácil acceso en ambas piernas y dos bolsillos extra en la zona lumbar.",
    ],
    features: [
      "Bolsillos amplios en ambas piernas",
      "Dos bolsillos lumbares adicionales",
      "Acceso rápido durante la ruta",
      "Pensado para gravel, cicloturismo y viajes",
    ],
    similar: ["culotte-puebla", "culotte-hiruela", "culotte-cardoso"],
  },
  {
    id: "culotte-rascafria",
    handle: "culotte-rascafria",
    title: "Rascafría",
    description: "Culotte largo térmico de color sólido para invierno",
    category: "culottes-largos",
    image: {
      src: ACCESSORY_ASSETS.rascafria.front,
      alt: "Culotte largo Rascafría personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.rascafria.front,
        alt: "Culotte largo Rascafría personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.rascafria.detail,
        alt: "Culotte largo Rascafría personalizado — detalle",
      },
      {
        src: ACCESSORY_ASSETS.chamois,
        alt: "Detalle de badana mostrado en la ficha original del culotte Rascafría",
      },
    ],
    techDrawing: {
      src: ACCESSORY_ASSETS.rascafria.technical,
      alt: "Culotte largo Rascafría — opciones de color sólido",
    },
    attributes: ["termico", "durable"],
    productDetails: {
      climate: "Invierno y días fríos · rango no publicado",
      fit: "Muy elástico y suave al uso",
      recommendedUse: "Entrenamientos de invierno con base de color sólido",
      construction: [
        "Tejido térmico interior perchado",
        "Base de tinta sólida Full Black o Full Dark Blue",
        "Logotipos Direct Transfer en paneles de pierna y parte trasera",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote:
        "La ficha original no publica los porcentajes exactos de fibra. " + SUBLIMATION_NOTE,
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje antes de producir.",
    },
    longDescription: [
      "Rascafría es el culotte largo de base sólida para los días de invierno. Emplea tejido térmico negro o azul oscuro, perchado por dentro, elástico y suave.",
      "Los paneles de pierna y la parte trasera admiten logotipos a todo color mediante Direct Transfer, manteniendo estable el color de la base al estirar.",
    ],
    features: [
      "Interior térmico perchado",
      "Base Full Black o Full Dark Blue",
      "Tejido elástico y suave",
      "Logotipos a color mediante Direct Transfer",
    ],
    similar: ["culotte-lozoya-buitrago"],
  },
  {
    id: "culotte-lozoya-buitrago",
    handle: "culotte-lozoya-buitrago",
    title: "Lozoya / Buitrago",
    description: "Culotte largo sublimado con dos niveles de personalización",
    category: "culottes-largos",
    image: {
      src: ACCESSORY_ASSETS.lozoyaBuitrago.front,
      alt: "Culotte largo Lozoya Buitrago personalizado — vista general",
    },
    gallery: [
      {
        src: ACCESSORY_ASSETS.lozoyaBuitrago.front,
        alt: "Culotte largo Lozoya Buitrago personalizado — vista general",
      },
      {
        src: ACCESSORY_ASSETS.lozoyaBuitrago.detail,
        alt: "Culotte largo Lozoya Buitrago personalizado — detalle",
      },
      {
        src: ACCESSORY_ASSETS.chamois,
        alt: "Detalle de badana mostrado en la ficha original del culotte Lozoya Buitrago",
      },
    ],
    techDrawing: {
      src: ACCESSORY_ASSETS.lozoyaBuitrago.technical,
      alt: "Culotte largo Lozoya Buitrago — opciones de personalización",
    },
    attributes: ["termico"],
    productDetails: {
      climate: "Invierno y días fríos · rango no publicado",
      fit: "Técnico, elástico y personalizable",
      recommendedUse: "Equipaciones invernales coordinadas a todo color",
      construction: [
        "Lozoya: grip o banda de pierna personalizados por sublimación",
        "Buitrago: panel completo del muslo y parte trasera sublimados",
        "Dos niveles de diseño para coordinar con maillot, chaleco o chaqueta",
      ],
      care: STANDARD_CARE,
      fiberCompositionNote:
        "La ficha original no publica los porcentajes exactos de fibra. " + SUBLIMATION_NOTE,
      sizingNote:
        "Tallaje XS–3XL. Usa el recomendador o solicita un kit de tallaje antes de producir.",
    },
    longDescription: [
      "Lozoya / Buitrago es el culotte largo para coordinar toda la equipación de invierno mediante sublimación a color.",
      "Lozoya personaliza la banda o grip de la pierna; Buitrago amplía la sublimación a todo el panel del muslo y la parte trasera.",
    ],
    features: [
      "Lozoya: personalización de la banda de pierna",
      "Buitrago: muslo y parte trasera sublimados",
      "Combinación visual con prendas superiores",
      "Dos niveles de superficie personalizable",
    ],
    similar: ["culotte-rascafria"],
  },
];

/** Los 4 modelos oficiales de /maillots_custom, para la colección destacada de la home. */
export const maillotsOficiales: Product[] = products.filter(
  (p) => p.category === "maillots"
);

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getSimilarProducts(product: Product): Product[] {
  if (!product.similar?.length) return [];
  return product.similar
    .map((h) => getProductByHandle(h))
    .filter((p): p is Product => Boolean(p));
}

export const localProvider: CommerceProvider = {
  async getProducts(category?: ProductCategory) {
    return category ? products.filter((p) => p.category === category) : products;
  },
  async getProduct(handle: string) {
    return getProductByHandle(handle);
  },
};

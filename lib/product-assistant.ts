import type { Product } from "@/lib/commerce/types";
import { getProductByHandle, products } from "@/lib/commerce/local";

export type ProductAssistantMode = "size" | "team" | "catalog" | "support";

const CATEGORY_LABELS: Record<Product["category"], string> = {
  maillots: "maillots de manga corta",
  "manga-larga": "prendas de manga larga",
  termicos: "maillots térmicos",
  chaquetas: "chaquetas",
  chalecos: "chalecos",
  "culottes-cortos": "culottes cortos",
  "culottes-largos": "culottes largos",
};

const ATTRIBUTE_LABELS: Record<string, string> = {
  ligero: "ligero",
  transpirable: "transpirable",
  aero: "aerodinámico",
  durable: "duradero",
  termico: "con protección térmica",
};

const STOP_WORDS = new Set([
  "para",
  "como",
  "cual",
  "cuales",
  "quiero",
  "necesito",
  "tiene",
  "sobre",
  "esta",
  "este",
  "unos",
  "unas",
  "ropa",
  "prenda",
  "producto",
  "racor",
]);

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function productLink(product: Product) {
  return `[${product.title}](/prendas/${product.handle})`;
}

function contactLink(product?: Product) {
  const suffix = product ? `?prenda=${encodeURIComponent(product.title)}` : "";
  return `[pedir una propuesta](/contacto${suffix})`;
}

function compactDetails(product: Product) {
  const details = [
    product.description,
    product.attributes?.length
      ? product.attributes.map((item) => ATTRIBUTE_LABELS[item] ?? item).join(", ")
      : undefined,
    product.features?.slice(0, 3).join("; "),
  ].filter(Boolean);

  return details.join(" · ");
}

function mentionedProducts(question: string, contextHandle?: string) {
  const normalized = normalize(question);
  const matches = products
    .filter((product) => normalized.includes(normalize(product.title)))
    .sort((a, b) => b.title.length - a.title.length);

  const refersToCurrent = includesAny(normalized, [
    "esta prenda",
    "este producto",
    "este modelo",
    "este maillot",
    "esta chaqueta",
    "este chaleco",
    "este culotte",
  ]);
  const contextProduct = contextHandle ? getProductByHandle(contextHandle) : undefined;

  if (refersToCurrent && contextProduct && !matches.some((item) => item.id === contextProduct.id)) {
    matches.unshift(contextProduct);
  }

  return [...new Map(matches.map((product) => [product.id, product])).values()];
}

function compareProducts(first: Product, second: Product) {
  const firstDetails = compactDetails(first) || "La ficha actual no publica más detalle técnico.";
  const secondDetails = compactDetails(second) || "La ficha actual no publica más detalle técnico.";

  return [
    `Comparación rápida entre ${productLink(first)} y ${productLink(second)}:`,
    "",
    `- **${first.title}:** ${firstDetails}`,
    `- **${second.title}:** ${secondDetails}`,
    "",
    `Si me dices **temperatura, tipo de salida y ajuste que buscas**, puedo afinar la elección. También puedes [consultar la talla](/tallaje).`,
  ].join("\n");
}

function describeProduct(product: Product) {
  const paragraphs = [
    `${productLink(product)} es ${product.description.charAt(0).toLowerCase()}${product.description.slice(1)}`,
  ];

  if (product.longDescription?.[0]) paragraphs.push(product.longDescription[0]);
  if (product.features?.length) {
    paragraphs.push(
      `**Puntos clave:** ${product.features.slice(0, 5).join("; ")}.`
    );
  }
  if (!product.longDescription?.length && !product.features?.length) {
    paragraphs.push(
      "La ficha disponible todavía no incluye más especificaciones técnicas; puedo ayudarte a solicitar ese detalle."
    );
  }

  paragraphs.push(
    `Se personaliza con presupuesto a medida. Puedes ${contactLink(product)} o [consultar el tallaje](/tallaje).`
  );
  return paragraphs.join("\n\n");
}

function listProducts(items: Product[], intro: string) {
  return [
    intro,
    "",
    ...items.map((product) => `- ${productLink(product)}: ${product.description}`),
  ].join("\n");
}

function searchProducts(question: string) {
  const tokens = normalize(question)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  if (!tokens.length) return [];

  return products
    .map((product) => {
      const searchable = normalize(
        [
          product.title,
          product.description,
          product.category,
          product.attributes?.join(" "),
          product.features?.join(" "),
          product.longDescription?.join(" "),
          product.productDetails
            ? JSON.stringify(product.productDetails)
            : undefined,
        ]
          .filter(Boolean)
          .join(" ")
      );
      const score = tokens.reduce(
        (total, token) => total + (searchable.includes(token) ? 1 : 0),
        0
      );
      return { product, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((result) => result.product);
}

export function getProductAssistantReply(
  question: string,
  contextHandle?: string,
  assistantMode?: ProductAssistantMode
) {
  const q = normalize(question.slice(0, 1_000));
  const mentioned = mentionedProducts(question, contextHandle);
  const wantsColdWeather = includesAny(q, [
    "invierno",
    "frio",
    "termic",
    "chaqueta",
    "lluvia",
    "agua",
    "viento",
    "humedo",
  ]);

  if (!q) {
    return "Escribe una pregunta sobre prendas, tallaje o equipaciones personalizadas y te ayudo.";
  }

  if (
    includesAny(q, [
      "en que me puedes ayudar",
      "como me puedes ayudar",
      "que puedes hacer",
      "que sabes hacer",
    ])
  ) {
    return [
      "Puedo ayudarte mediante cuatro modos especializados:",
      "",
      "- **Modo talla:** fit, medidas, ajuste y kit de tallaje.",
      "- **Custom team:** solicitud guiada para clubes y equipos.",
      "- **Modo catálogo:** prendas recomendadas según disciplina, clima y uso.",
      "- **Modo soporte:** producción, pedido mínimo, pagos, logotipos, reposiciones y envíos.",
      "",
      "Elige el modo que mejor encaje con tu consulta y te guiaré paso a paso.",
    ].join("\n");
  }

  if (
    assistantMode === "size" &&
    includesAny(q, ["necesito ayuda con mi talla y ajuste", "iniciar modo talla"])
  ) {
    return "Vamos a encontrar el ajuste adecuado. Indícame **qué prenda te interesa**, tu **altura y peso aproximados**, la talla que utilizas habitualmente y si prefieres un ajuste **ceñido o más cómodo**. Para equipos también puedo explicarte cómo solicitar un kit de tallaje.";
  }

  if (
    assistantMode === "team" &&
    includesAny(q, ["equipacion personalizada para mi club", "iniciar custom team"])
  ) {
    return [
      "Para preparar una propuesta de equipo necesito cinco datos:",
      "",
      "1. **Nombre del club o equipo**.",
      "2. **Número aproximado de ciclistas**.",
      "3. **Fecha objetivo de entrega**.",
      "4. **Disciplina principal**: carretera, MTB, gravel, triatlón u otra.",
      "5. **Prendas que necesitáis**: maillot, culotte, chaqueta, chaleco u otras.",
      "",
      "Puedes responder con todo en un solo mensaje y organizaré la solicitud.",
    ].join("\n");
  }

  if (
    assistantMode === "catalog" &&
    includesAny(q, ["encontrar la prenda adecuada para mi uso", "iniciar modo catalogo"])
  ) {
    return "Para recomendarte una prenda, dime **qué disciplina practicas**, la **temperatura o clima habitual**, el tipo de salida y si buscas ligereza, protección, aerodinámica o mayor capacidad de carga.";
  }

  if (
    assistantMode === "support" &&
    includesAny(q, ["ayuda con produccion envios logos o reposiciones", "iniciar modo soporte"])
  ) {
    return "Puedo ayudarte con **plazos de producción, pedido mínimo, condiciones de pago, preparación de logotipos, reposiciones y consultas de envío**. Indícame qué necesitas resolver y te daré la información disponible o te dirigiré al contacto adecuado.";
  }

  if (
    mentioned.length >= 2 &&
    includesAny(q, ["compar", "diferencia", "versus", " vs ", "mejor entre"])
  ) {
    return compareProducts(mentioned[0], mentioned[1]);
  }

  if (includesAny(q, ["precio", "cuesta", "coste", "presupuesto", "tarifa"])) {
    const product = mentioned[0];
    return `RACOR trabaja con **presupuesto a medida** porque cada equipación puede cambiar en diseño, prendas y cantidad. No publico una cifra que pueda ser inexacta. Puedes ${contactLink(product)}; no hay pedido mínimo y el diseño está incluido.`;
  }

  if (includesAny(q, ["talla", "tallaje", "medida", "xs", "2xl", "3xl"])) {
    return "Las prendas se ofrecen de **XS a 3XL**. La [guía de tallas](/tallaje) incluye medidas y recomendador. Para clubes y equipos también se puede enviar un kit de tallaje para probar antes de producir.";
  }

  if (includesAny(q, ["pedido minimo", "minimo", "una prenda", "1 prenda"])) {
    return "No hay pedido mínimo: RACOR trabaja **desde 1 prenda**, con la misma calidad y personalización. El diseño está incluido. Consulta [cómo trabajamos](/nosotros#proceso) o puedes [contarnos tu idea](/contacto).";
  }

  if (includesAny(q, ["plazo", "entrega", "cuando llega", "cuanto tarda", "tiempo"])) {
    return "El plazo orientativo es de **4 semanas (30 días)** desde la aprobación definitiva del diseño. Para una fecha concreta conviene [confirmar disponibilidad con RACOR](/contacto).";
  }

  if (includesAny(q, ["pago", "anticipo", "transferencia"])) {
    return "La condición publicada es **50% de anticipo y 50% antes de la entrega**, mediante transferencia bancaria. Puedes ver el resto de [condiciones del proceso](/nosotros#condiciones).";
  }

  if (includesAny(q, ["formato de logo", "formatos de logo", "archivo de logo", "logos", "logotipos"])) {
    return "Para trabajar un diseño con buena calidad, lo más seguro es aportar los logotipos en **formato vectorial** —AI, EPS, SVG o PDF vectorial—. Si solo dispones de PNG, envíalo con fondo transparente y la mayor resolución posible. RACOR revisará los archivos antes de preparar el diseño definitivo.";
  }

  if (includesAny(q, ["reposicion", "reponer", "repetir pedido", "pedido anterior"])) {
    return "Para una reposición, indica el **nombre del equipo, el diseño o pedido anterior, las prendas, tallas y cantidades** que necesitas. RACOR revisará los archivos y la disponibilidad del modelo antes de confirmar plazo y presupuesto. Puedes [solicitar la reposición](/contacto).";
  }

  if (includesAny(q, ["proceso", "como trabaj", "personaliza", "diseno", "logotipo", "colores"])) {
    return "El proceso tiene cuatro pasos: **1) tu idea, 2) selección de prendas y tallas, 3) propuestas de diseño hasta aprobación y 4) producción en Madrid con control de calidad**. No hay pedido mínimo y el diseño está incluido. [Ver el proceso completo](/nosotros#proceso).";
  }

  if (includesAny(q, ["madrid", "local", "sostenib", "donde fabrica", "produccion"])) {
    return "RACOR diseña, desarrolla y confecciona en **Madrid**, con tejidos nacionales y producción bajo demanda para evitar stock sobrante. Puedes conocer los [tres pilares y el proceso](/nosotros).";
  }

  if (includesAny(q, ["chaleco", "cortaviento"])) {
    const options = products.filter((product) => product.category === "chalecos");
    return `${listProducts(
      options,
      "Hay tres chalecos con niveles de protección muy distintos:"
    )}\n\n**Soto del Real** ocupa menos y abriga menos; **Miraflores** equilibra protección y ventilación; **Escorial** es térmico, añade softshell y tres bolsillos para **0–16 ºC**.`;
  }

  if (includesAny(q, ["cargo", "gravel", "bikepacking", "bolsillo lateral", "bolsillos en las piernas"])) {
    const somosierra = getProductByHandle("culotte-somosierra");
    return somosierra
      ? `${productLink(somosierra)} es el culotte corto pensado para gravel, cicloturismo y viajes: incorpora **dos bolsillos en las piernas y dos bolsillos lumbares**.`
      : "Puedo ayudarte a elegir un culotte cargo si me indicas el tipo de ruta.";
  }

  if (includesAny(q, ["culotte corto", "culote corto", "puebla", "hiruela", "cardoso", "somosierra"])) {
    const options = products.filter(
      (product) => product.category === "culottes-cortos"
    );
    return `${listProducts(
      options,
      "Los culottes cortos se diferencian por la superficie personalizable y la capacidad de carga:"
    )}\n\n**Puebla** usa base de color sólido; **Hiruela** combina base sólida y zonas sublimadas; **Cardoso** se sublima por completo; **Somosierra** añade bolsillos cargo.`;
  }

  if (includesAny(q, ["culotte largo", "culote largo", "rascafria", "lozoya", "buitrago"])) {
    const options = products.filter(
      (product) => product.category === "culottes-largos"
    );
    return `${listProducts(
      options,
      "Hay dos culottes largos para invierno:"
    )}\n\n**Rascafría** prioriza una base térmica de color sólido con logotipos Direct Transfer; **Lozoya / Buitrago** permite sublimar la banda de pierna o ampliar el diseño al muslo y la parte trasera.`;
  }

  if (includesAny(q, ["verano", "calor", "caluroso", "transpirable", "ligero", "mucho sol"])) {
    const options = products.filter((product) =>
      ["maillot-morcuera-2-0", "maillot-morcuera-oficial", "maillot-navafria-oficial"].includes(
        product.handle
      )
    );
    return listProducts(
      options,
      "Para calor y alta transpirabilidad, estas son las opciones mejor documentadas del catálogo:"
    );
  }

  if (includesAny(q, ["resistent", "durader", "uso intensivo", "gramaje"])) {
    const canencia = getProductByHandle("maillot-canencia");
    return canencia
      ? `${productLink(canencia)} es la opción más clara: usa tejidos de mayor gramaje para ganar resistencia y durabilidad sin renunciar a la transpiración.`
      : "Puedo ayudarte a elegir una prenda resistente si me indicas el tipo de uso.";
  }

  if (
    !wantsColdWeather &&
    (includesAny(q, [
      "otono",
      "primavera",
      "fresco",
      "15",
      "18",
      "20",
      "22",
      "entretiempo",
    ]) ||
      q.includes("manga larga"))
  ) {
    const options = products.filter((product) =>
      [
        "maillot-manga-larga-fuenfria",
        "maillot-manga-larga-cruz-verde",
      ].includes(product.handle)
    );
    return `${listProducts(
      options,
      "Para entretiempo hay dos opciones con rango térmico publicado:"
    )}\n\n**Fuenfría** es más fino y transpirable; **Cruz Verde** aporta más abrigo gracias a su lycra semitérmica de 230 g/m². Por debajo de 15 ºC conviene confirmar una combinación más térmica con RACOR.`;
  }

  if (includesAny(q, ["lluvia", "agua", "viento", "humedo", "mojado"])) {
    const bolaDelMundo = getProductByHandle("chaqueta-bola-del-mundo");
    return bolaDelMundo
      ? `${productLink(bolaDelMundo)} es la opción documentada para **lluvia, viento y frío intenso**. Usa softshell hidrófugo y cortaviento de doble capa, con rango publicado de **menos de 0 a 15 ºC**. La ficha no publica una clasificación impermeable certificada.`
      : "Para lluvia y viento conviene confirmar la chaqueta adecuada con RACOR.";
  }

  if (q.includes("chaqueta")) {
    const options = products.filter(
      (product) => product.category === "chaquetas"
    );
    return `${listProducts(
      options,
      "Hay dos chaquetas con comportamiento muy diferente:"
    )}\n\n**Navacerrada** prioriza transpirabilidad en clima seco; **Bola del Mundo** añade softshell hidrófugo y cortaviento para invierno exigente.`;
  }

  if (includesAny(q, ["invierno", "frio", "termic"])) {
    const options = products.filter((product) =>
      [
        "maillot-manga-larga-termico-cotos",
        "maillot-manga-larga-termico-alto-del-leon",
        "chaqueta-navacerrada",
        "chaqueta-bola-del-mundo",
      ].includes(product.handle)
    );
    return `${listProducts(
      options,
      "Para frío, estas opciones tienen rango térmico publicado:"
    )}\n\nCotos y Alto del León son para **clima seco**. Navacerrada mantiene mucha ventilación; Bola del Mundo es la más protectora frente a lluvia y viento.`;
  }

  if (includesAny(q, ["club", "equipo", "equipacion completa", "grupo"])) {
    return "Para clubes y equipos se personalizan prendas, cantidades y tallas, con **diseño incluido**, sin pedido mínimo y opción de **kit de tallaje** antes de producir. El primer paso es [contar vuestra idea y fecha objetivo](/contacto).";
  }

  if (includesAny(q, ["lavado", "lavar", "cuidado", "secadora", "suavizante"])) {
    const product = mentioned[0];
    const care = product?.productDetails?.care ?? [
      "Lavar del revés a un máximo de 30 ºC",
      "No usar suavizante, lejía ni secadora",
      "Secar a la sombra y no planchar",
    ];
    const intro = product
      ? `Cuidados recomendados para ${productLink(product)}:`
      : "Cuidados generales recomendados para las prendas RACOR:";
    return `${intro}\n\n${care.map((item) => `- ${item}`).join("\n")}\n\nSi la etiqueta interior indica algo diferente, sigue siempre la etiqueta de la prenda.`;
  }

  if (includesAny(q, ["composicion", "tejido", "gramaje", "fibra", "material"])) {
    const product = mentioned[0];
    if (product?.productDetails) {
      return [
        `Construcción publicada de ${productLink(product)}:`,
        "",
        ...product.productDetails.construction.map((item) => `- ${item}`),
        "",
        product.productDetails.fiberCompositionNote,
      ]
        .filter(Boolean)
        .join("\n");
    }
  }

  if (includesAny(q, ["devolucion", "cambio", "envio", "portes", "stock"])) {
    return "Ese dato no está publicado con suficiente detalle en el catálogo y prefiero no inventarlo. Puedes [preguntarlo directamente a RACOR](/contacto) o escribir por [WhatsApp](https://wa.me/34653224053).";
  }

  if (mentioned[0]) return describeProduct(mentioned[0]);

  if (includesAny(q, ["catalogo", "que teneis", "que prendas", "productos", "modelos"])) {
    const lines = Object.entries(CATEGORY_LABELS).map(([category, label]) => {
      const count = products.filter((product) => product.category === category).length;
      return `- **${label}:** ${count} modelos`;
    });
    return `El catálogo reúne ${products.length} prendas y diseños:\n\n${lines.join("\n")}\n\nPuedes [ver todas las prendas](/prendas) o decirme clima, uso y ajuste para recomendarte.`;
  }

  const results = searchProducts(question);
  if (results.length) {
    return listProducts(
      results,
      "Por lo que describes, estas son las coincidencias más cercanas del catálogo:"
    );
  }

  if (assistantMode === "size") {
    return "Para orientarte con la talla necesito saber **qué prenda buscas**, tu talla habitual y si prefieres un ajuste ceñido o cómodo. También puedes consultar la [guía de tallas](/tallaje).";
  }

  if (assistantMode === "team") {
    return "Para continuar con la equipación del equipo, indícame **nombre del club, número de ciclistas, fecha objetivo, disciplina y prendas necesarias**. Con esos datos podré ordenar la solicitud.";
  }

  if (assistantMode === "catalog") {
    return "Dime la **disciplina, el clima, el tipo de salida y la característica que priorizas** para recomendarte las prendas más adecuadas del catálogo.";
  }

  if (assistantMode === "support") {
    return "Puedo revisar contigo **producción, pedido mínimo, pagos, logotipos, reposiciones y envíos**. Si el dato no está publicado, te indicaré cómo confirmarlo con RACOR.";
  }

  return "Puedo ayudarte con **modelos, clima, tallaje, personalización, plazos y pedidos de equipo**. Prueba a preguntarme «¿qué maillot va mejor para calor?» o [contacta con RACOR](/contacto) si necesitas confirmar un detalle no publicado.";
}

export function getCatalogContext(contextHandle?: string) {
  const current = contextHandle ? getProductByHandle(contextHandle) : undefined;
  const compactProducts = products.map((product) => ({
    title: product.title,
    handle: product.handle,
    category: CATEGORY_LABELS[product.category],
    description: product.description,
    tag: product.tag,
    attributes: product.attributes,
    features: product.features,
    details: product.longDescription,
    fabrics: product.fabrics?.map(({ name, description }) => ({ name, description })),
    productDetails: product.productDetails,
  }));

  return JSON.stringify(
    {
      currentProduct: current?.title,
      business: {
        location: "Madrid ciudad",
        manufacturing: "Diseño, desarrollo y confección en Madrid con tejidos nacionales",
        minimumOrder: "Desde 1 prenda; no hay pedido mínimo",
        delivery: "4 semanas aproximadas (30 días) desde la aprobación definitiva del diseño",
        design: "Diseño personalizado incluido sin coste adicional",
        payment: "50% de anticipo y 50% antes de la entrega mediante transferencia",
        sizes: "XS a 3XL; guía y recomendador; kit de tallaje para equipos",
      },
      products: compactProducts,
    },
    null,
    2
  );
}

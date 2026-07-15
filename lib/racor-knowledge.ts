import { getSupabaseServerClient } from "@/lib/supabase/server";

const SEARCH_STOP_WORDS = new Set([
  "a",
  "al",
  "algo",
  "como",
  "con",
  "cual",
  "cuál",
  "cuando",
  "de",
  "del",
  "el",
  "en",
  "es",
  "esta",
  "este",
  "hay",
  "la",
  "las",
  "lo",
  "los",
  "me",
  "mi",
  "puedo",
  "para",
  "por",
  "que",
  "qué",
  "quiero",
  "se",
  "si",
  "sin",
  "sobre",
  "su",
  "tengo",
  "un",
  "una",
  "y",
]);

const SEARCH_INTENT_EXPANSIONS: Array<{
  pattern: RegExp;
  terms: string[];
}> = [
  {
    pattern: /\b(pag(?:ar|o|os|amos)?|anticipo|transferencia)\b/,
    terms: ["pago", "condiciones", "anticipo", "transferencia"],
  },
  {
    pattern: /\b(plazo|tard(?:a|an|ara|aran)?|entrega|produccion)\b/,
    terms: ["plazo", "produccion", "entrega"],
  },
  {
    pattern: /\b(talla|tallas|tallaje|medida|medidas)\b/,
    terms: ["tallas", "tallaje", "kit"],
  },
  {
    pattern: /\b(precio|precios|cuesta|coste|presupuesto|presupuestos)\b/,
    terms: ["precio", "presupuestos"],
  },
  {
    pattern: /\b(pedido|pedidos|minimo|minima|cantidad)\b/,
    terms: ["pedido", "minimo", "diseno"],
  },
];

export type RacorKnowledgeMatch = {
  source_type: "knowledge" | "product";
  source_id: string;
  handle: string | null;
  title: string;
  content: string;
  rank: number;
};

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function getMeaningfulSearchTerms(query: string) {
  const normalizedQuery = normalizeSearchText(query);
  const words = normalizedQuery.match(/[\p{L}\p{N}]+/gu) ?? [];
  const primaryIntent = SEARCH_INTENT_EXPANSIONS.find((intent) =>
    intent.pattern.test(normalizedQuery)
  );
  const intentTerms = primaryIntent?.terms ?? [];

  return [
    ...new Set([
      ...intentTerms,
      ...words.filter((word) => word.length > 2 && !SEARCH_STOP_WORDS.has(word)),
    ]),
  ].slice(0, 10);
}

function rankNaturalMatches(matches: RacorKnowledgeMatch[], terms: string[]) {
  const normalizedTerms = terms.map(normalizeSearchText);

  return matches
    .map((match) => {
      const title = normalizeSearchText(match.title);
      const content = normalizeSearchText(match.content);
      const titleHits = normalizedTerms.filter((term) => title.includes(term)).length;
      const contentHits = normalizedTerms.filter((term) => content.includes(term)).length;

      return {
        ...match,
        rank: match.rank + titleHits * 0.3 + contentHits * 0.04,
      };
    })
    .sort((left, right) => right.rank - left.rank);
}

export async function searchRacorKnowledge(
  queryText: string,
  matchCount = 8
): Promise<RacorKnowledgeMatch[]> {
  const query = queryText.trim().slice(0, 1_000);
  const supabase = getSupabaseServerClient();

  if (query.length < 2 || !supabase) return [];

  const safeMatchCount = Math.max(1, Math.min(matchCount, 20));
  const search = async (searchText: string) => {
    const { data, error } = await supabase.rpc("search_racor_knowledge", {
      query_text: searchText,
      match_count: safeMatchCount,
    });

    if (error) {
      console.error("[RACOR knowledge] Supabase query failed:", error.message);
      return [];
    }

    return Array.isArray(data) ? (data as RacorKnowledgeMatch[]) : [];
  };

  const preciseMatches = await search(query);
  if (preciseMatches.length) return preciseMatches;

  const terms = getMeaningfulSearchTerms(query);
  if (!terms.length) return [];

  const broadMatches = await search(terms.join(" OR "));

  return rankNaturalMatches(broadMatches, terms);
}

export function formatRacorKnowledgeContext(matches: RacorKnowledgeMatch[]) {
  if (!matches.length) return "Sin coincidencias adicionales en la base de conocimiento.";

  return matches
    .map(
      (match, index) =>
        `${index + 1}. [${match.source_type}] ${match.title}\n${match.content}`
    )
    .join("\n\n");
}

export function getRacorKnowledgeReply(matches: RacorKnowledgeMatch[]) {
  const bestMatch = matches[0];
  if (!bestMatch) return null;

  const productLink =
    bestMatch.source_type === "product" && bestMatch.handle
      ? `\n\n[Ver ${bestMatch.title}](/prendas/${bestMatch.handle})`
      : "";

  return `**${bestMatch.title}**\n\n${bestMatch.content}${productLink}`;
}

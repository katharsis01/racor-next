import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  getCatalogContext,
  getProductAssistantReply,
  type ProductAssistantMode,
} from "@/lib/product-assistant";
import {
  formatRacorKnowledgeContext,
  getRacorKnowledgeReply,
  searchRacorKnowledge,
} from "@/lib/racor-knowledge";

export const maxDuration = 30;

function messageText(message?: UIMessage) {
  return (message?.parts ?? [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim();
}

function isCapabilitiesQuestion(question: string) {
  const normalized = question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return [
    "en que me puedes ayudar",
    "como me puedes ayudar",
    "que puedes hacer",
    "que sabes hacer",
  ].some((phrase) => normalized.includes(phrase));
}

const ASSISTANT_MODE_INSTRUCTIONS: Record<ProductAssistantMode, string> = {
  size:
    "MODO TALLA: ayuda con fit, medidas y elección de talla. Pregunta por prenda, altura, peso, talla habitual y preferencia de ajuste cuando falten datos. No garantices una talla sin información suficiente.",
  team:
    "MODO CUSTOM TEAM: guía una solicitud comercial y recopila nombre del club, número de ciclistas, fecha objetivo, disciplina y prendas necesarias. Resume los datos antes de derivar a contacto.",
  catalog:
    "MODO CATÁLOGO: recomienda prendas exclusivamente del catálogo según disciplina, clima, tipo de salida y prioridad técnica. Incluye enlaces de producto cuando haya una coincidencia clara.",
  support:
    "MODO SOPORTE: atiende producción, envíos, pedido mínimo, pagos, formatos de logotipos y reposiciones. Si una política concreta no está documentada, dilo y deriva a contacto.",
};

function parseAssistantMode(value: unknown): ProductAssistantMode | undefined {
  return value === "size" ||
    value === "team" ||
    value === "catalog" ||
    value === "support"
    ? value
    : undefined;
}

function isGuidedModeStart(question: string, mode?: ProductAssistantMode) {
  if (!mode) return false;
  const normalized = question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const starts: Record<ProductAssistantMode, string> = {
    size: "necesito ayuda con mi talla y ajuste",
    team: "equipacion personalizada para mi club",
    catalog: "encontrar la prenda adecuada para mi uso",
    support: "ayuda con produccion, envios, logos o reposiciones",
  };

  return normalized.includes(starts[mode]);
}

function localResponse(text: string, originalMessages: UIMessage[]) {
  const textId = crypto.randomUUID();
  const stream = createUIMessageStream<UIMessage>({
    originalMessages,
    execute: ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "text-start", id: textId });
      writer.write({ type: "text-delta", id: textId, delta: text });
      writer.write({ type: "text-end", id: textId });
      writer.write({ type: "finish", finishReason: "stop" });
    },
    onError: () => "No he podido preparar la respuesta.",
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(request: Request) {
  let body: {
    messages?: UIMessage[];
    contextHandle?: string;
    assistantMode?: ProductAssistantMode;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length > 30) {
    return Response.json({ error: "Conversación no válida" }, { status: 400 });
  }

  const messages = body.messages.slice(-12);
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const question = messageText(lastUserMessage).slice(0, 1_000);
  const contextHandle =
    typeof body.contextHandle === "string" ? body.contextHandle.slice(0, 120) : undefined;
  const assistantMode = parseAssistantMode(body.assistantMode);

  if (!question) {
    return localResponse(
      "Escribe una pregunta sobre prendas, tallaje o equipaciones personalizadas y te ayudo.",
      messages
    );
  }

  if (isCapabilitiesQuestion(question) || isGuidedModeStart(question, assistantMode)) {
    return localResponse(
      getProductAssistantReply(question, contextHandle, assistantMode),
      messages
    );
  }

  const useAi =
    process.env.RACOR_ASSISTANT_AI === "true" &&
    Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
  const knowledgeMatches = await searchRacorKnowledge(question);

  if (!useAi) {
    return localResponse(
      getRacorKnowledgeReply(knowledgeMatches) ??
        getProductAssistantReply(question, contextHandle, assistantMode),
      messages
    );
  }

  const result = streamText({
    model: process.env.RACOR_ASSISTANT_MODEL || "openai/gpt-5.4",
    instructions: `Eres el asistente de producto de RACOR, una marca madrileña de ropa ciclista personalizada.

Responde siempre en español con un tono profesional, claro, preciso y cercano. Empieza por la respuesta principal y evita expresiones informales, relleno o afirmaciones no documentadas. Usa exclusivamente los datos del contexto de catálogo incluido abajo. No inventes precios, stock, rangos térmicos, materiales, políticas, plazos ni prestaciones. Si el dato no está en el contexto, dilo claramente y deriva a /contacto. Para precio, explica que es presupuesto a medida. Cuando recomiendes un producto, enlázalo con Markdown usando /prendas/HANDLE. Para tallaje, enlaza /tallaje. Para proceso, enlaza /nosotros#proceso. No des consejos médicos ni de seguridad.

${assistantMode ? ASSISTANT_MODE_INSTRUCTIONS[assistantMode] : "MODO GENERAL: ayuda al usuario a elegir uno de los recorridos de talla, custom team, catálogo o soporte."}

CONTEXTO DOCUMENTADO DEL CATÁLOGO:
${getCatalogContext(contextHandle)}

INFORMACIÓN ADICIONAL DE LA BASE DE CONOCIMIENTO:
${formatRacorKnowledgeContext(knowledgeMatches)}`,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onError: () =>
        "No he podido consultar el modo inteligente. Prueba de nuevo o contacta con RACOR.",
    }),
  });
}

"use client";

import { useEffect, useMemo, useState, type ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Clock3,
  LifeBuoy,
  Loader2,
  MessageCircle,
  RotateCcw,
  Ruler,
  Shirt,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Components } from "streamdown";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getProductByHandle,
  getSimilarProducts,
  maillotsOficiales,
} from "@/lib/commerce/local";
import type { Product } from "@/lib/commerce/types";
import type { ProductAssistantMode } from "@/lib/product-assistant";
import {
  classifyProductQuestion,
  trackEvent,
} from "@/lib/analytics-events";
import { ASSISTANT_OPEN_EVENT } from "@/components/site/assistant-launcher";
import { cn } from "@/lib/utils";

const ASSISTANT_HISTORY_KEY = "racor-product-assistant-history-v3";

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "racor-welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Soy el **asistente comercial especializado de RACOR**. Puedo ayudarte a elegir talla, preparar una equipación para tu equipo, encontrar una prenda o resolver una consulta de soporte.\n\nElige un modo para empezar.",
      },
    ],
  },
];

const ASSISTANT_MODES: Array<{
  id: ProductAssistantMode;
  label: string;
  eyebrow: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
}> = [
  {
    id: "size",
    label: "Modo talla",
    eyebrow: "Fit y medidas",
    description: "Encuentra el ajuste adecuado para cada prenda.",
    prompt: "Necesito ayuda con mi talla y ajuste.",
    icon: Ruler,
  },
  {
    id: "team",
    label: "Custom team",
    eyebrow: "Clubes y equipos",
    description: "Prepara una solicitud completa para tu equipación.",
    prompt: "Quiero preparar una equipación personalizada para mi club.",
    icon: UsersRound,
  },
  {
    id: "catalog",
    label: "Modo catálogo",
    eyebrow: "Prendas y uso",
    description: "Localiza el modelo adecuado según clima y disciplina.",
    prompt: "Quiero encontrar la prenda adecuada para mi uso.",
    icon: Shirt,
  },
  {
    id: "support",
    label: "Modo soporte",
    eyebrow: "Pedidos y producción",
    description: "Resuelve plazos, logos, reposiciones y envíos.",
    prompt: "Necesito ayuda con producción, envíos, logos o reposiciones.",
    icon: LifeBuoy,
  },
];

const MODE_SUGGESTIONS: Record<ProductAssistantMode, string[]> = {
  size: ["¿Cómo elijo mi talla?", "¿Tenéis kit de tallaje?", "Prefiero un ajuste cómodo"],
  team: ["Somos 20 ciclistas", "Pedido mínimo", "Plazo de producción"],
  catalog: ["Maillot para mucho calor", "Chaqueta para lluvia y frío", "Culotte para gravel"],
  support: ["Formatos de logos", "Reposiciones", "Plazo de producción", "Envíos"],
};

function parseSavedConversation(raw: string | null): UIMessage[] | null {
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return null;

    const messages = value.flatMap((item): UIMessage[] => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Record<string, unknown>;
      const role = candidate.role;
      if (role !== "assistant" && role !== "user") return [];
      if (typeof candidate.id !== "string" || !Array.isArray(candidate.parts)) return [];

      const parts = candidate.parts.flatMap((part) => {
        if (!part || typeof part !== "object") return [];
        const textPart = part as Record<string, unknown>;
        if (textPart.type !== "text" || typeof textPart.text !== "string") return [];

        return [{ type: "text" as const, text: textPart.text.slice(0, 4_000) }];
      });

      if (!parts.length) return [];
      return [{ id: candidate.id, role, parts }];
    });

    return messages.length ? messages.slice(-20) : null;
  } catch {
    return null;
  }
}

function RacorAssistantMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full border border-white/20 bg-white text-racor shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
        compact ? "size-7" : "size-10"
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        className={compact ? "size-4" : "size-6"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 25V7.5H15c4.15 0 6.5 2.1 6.5 5.35S19.15 18.2 15 18.2H7.5M15.3 18.2 22.6 25"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M25.25 5.25V9.5M23.125 7.375h4.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
      <span
        className={cn(
          "absolute rounded-full border-2 border-racor bg-emerald-400 shadow-[0_0_0_2px_rgba(255,255,255,0.15)]",
          compact ? "-right-0.5 -bottom-0.5 size-2" : "-right-1 -bottom-1 size-3"
        )}
      />
    </span>
  );
}

function ProductRecommendationCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (href: string) => void;
}) {
  const href = `/prendas/${product.handle}`;

  return (
    <Link
      href={href}
      onClick={() => onOpen(href)}
      className="group/card w-[150px] shrink-0 border border-neutral-200 bg-white transition-colors hover:border-racor"
    >
      <span className="relative block h-16 overflow-hidden bg-neutral-100">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="150px"
          className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
        />
      </span>
      <span className="block p-2.5">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-racor">
          {product.category.replaceAll("-", " ")}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.05em]">
          {product.title}
        </span>
      </span>
    </Link>
  );
}

export function ProductAssistant() {
  const pathname = usePathname();
  const compactLauncher = pathname.startsWith("/configurador/");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState<ProductAssistantMode | null>(null);
  const [historyReady, setHistoryReady] = useState(false);

  const contextHandle = useMemo(() => {
    const match = pathname.match(/^\/prendas\/(?!categoria\/)([^/]+)$/);
    return match ? decodeURIComponent(match[1]) : undefined;
  }, [pathname]);
  const currentProduct = contextHandle ? getProductByHandle(contextHandle) : undefined;
  const featuredProducts = useMemo(
    () =>
      currentProduct
        ? [currentProduct, ...getSimilarProducts(currentProduct)].slice(0, 3)
        : maillotsOficiales.slice(0, 3),
    [currentProduct]
  );

  useEffect(() => {
    const openAssistant = () => {
      setOpen(true);
      trackEvent("chat_open", {
        page: pathname,
        product: contextHandle,
      });
    };
    window.addEventListener(ASSISTANT_OPEN_EVENT, openAssistant);
    return () => window.removeEventListener(ASSISTANT_OPEN_EVENT, openAssistant);
  }, [contextHandle, pathname]);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/product-assistant" }),
    []
  );
  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    clearError,
    setMessages,
  } = useChat({
    id: "racor-product-assistant",
    messages: INITIAL_MESSAGES,
    transport,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedMessages = parseSavedConversation(
        window.localStorage.getItem(ASSISTANT_HISTORY_KEY)
      );
      if (savedMessages) setMessages(savedMessages);
      setHistoryReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [setMessages]);

  useEffect(() => {
    if (!historyReady || status === "submitted" || status === "streaming") return;

    try {
      window.localStorage.setItem(
        ASSISTANT_HISTORY_KEY,
        JSON.stringify(messages.slice(-20))
      );
    } catch {
      // El asistente sigue funcionando aunque el navegador bloquee localStorage.
    }
  }, [historyReady, messages, status]);

  const activeModeConfig = activeMode
    ? ASSISTANT_MODES.find((mode) => mode.id === activeMode)
    : undefined;
  const ActiveModeIcon = activeModeConfig?.icon;
  const suggestions = activeMode
    ? MODE_SUGGESTIONS[activeMode]
    : currentProduct
      ? [
          `¿Qué destaca de ${currentProduct.title}?`,
          "¿Cómo elijo mi talla?",
          "Plazo de producción",
        ]
      : [];
  const savedMessageCount = Math.max(0, messages.length - 1);

  async function ask(
    text: string,
    requestedMode: ProductAssistantMode | null = activeMode
  ) {
    const question = text.trim();
    if (!question || status === "submitted" || status === "streaming") return;
    clearError();
    setInput("");
    trackEvent("chat_question", {
      intent: classifyProductQuestion(question),
      product: contextHandle,
    });
    await sendMessage(
      { text: question },
      {
        body: {
          ...(contextHandle ? { contextHandle } : {}),
          ...(requestedMode ? { assistantMode: requestedMode } : {}),
        },
      }
    );
  }

  async function startMode(mode: (typeof ASSISTANT_MODES)[number]) {
    setActiveMode(mode.id);
    trackEvent("chat_mode_select", {
      mode: mode.id,
      product: contextHandle,
    });
    await ask(mode.prompt, mode.id);
  }

  async function handleSubmit(message: PromptInputMessage) {
    await ask(message.text);
  }

  function startNewConversation() {
    stop();
    clearError();
    setActiveMode(null);
    setMessages(INITIAL_MESSAGES);
    try {
      window.localStorage.removeItem(ASSISTANT_HISTORY_KEY);
    } catch {
      // El reinicio visual funciona aunque localStorage no esté disponible.
    }
  }

  function openProduct(href: string) {
    trackEvent("chat_result_click", {
      destination: href,
      product: contextHandle,
    });
    setOpen(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          trackEvent("chat_open", {
            page: pathname,
            product: contextHandle,
          });
        }
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          className={`group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] grid place-items-center rounded-full border border-white/20 bg-racor text-white shadow-[0_18px_45px_rgba(0,0,0,0.3)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_24px_60px_rgba(0,0,0,0.36)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-racor sm:right-5 sm:bottom-5 md:right-6 md:bottom-6 ${open ? "pointer-events-none invisible opacity-0" : "opacity-100"} ${compactLauncher ? "size-13" : "size-16"}`}
          aria-label="Abrir asistente comercial RACOR"
        >
          <span className="pointer-events-none absolute inset-1 rounded-full border border-white/10" />
          <span className="text-[21px] font-semibold tracking-[-0.08em]" aria-hidden="true">
            R<sup className="ml-0.5 text-[10px] font-medium">+</sup>
          </span>
          <span className="absolute right-0 bottom-0 size-4 rounded-full border-[3px] border-racor bg-emerald-400" aria-hidden="true" />
          <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] hidden w-max border border-neutral-800 bg-neutral-950 px-3 py-2 text-left text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.17em] text-white/55">
              Asistente RACOR
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold">¿Cómo puedo ayudarte?</span>
          </span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="left-0 w-auto max-w-none gap-0 p-0 sm:left-auto sm:w-[540px] sm:max-w-[540px] [&_[data-slot=sheet-close]]:text-white"
      >
        <SheetHeader className="gap-4 bg-racor px-5 py-6 pr-14 text-left text-white sm:px-6">
          <div className="flex items-center gap-3">
            <RacorAssistantMark />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Asistente comercial de ciclismo
              </p>
              <SheetTitle className="mt-1 text-xl uppercase tracking-tight text-white">
                ¿Cómo puedo ayudarte?
              </SheetTitle>
            </div>
          </div>

          <SheetDescription className="max-w-[430px] text-sm leading-relaxed text-white/70">
            Elige un recorrido especializado para recibir una orientación más precisa.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-2 text-[10px] uppercase tracking-[0.09em] text-neutral-500 sm:px-6">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-3.5" aria-hidden="true" />
            Historial guardado · {savedMessageCount} {savedMessageCount === 1 ? "mensaje" : "mensajes"}
          </span>
          <button
            type="button"
            onClick={startNewConversation}
            disabled={savedMessageCount === 0}
            className="inline-flex items-center gap-1.5 font-semibold text-racor transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Nueva conversación
          </button>
        </div>

        <Conversation className="min-h-0 bg-white">
          <ConversationContent className="gap-6 px-5 py-6 sm:px-6">
            {currentProduct && (
              <div className="border border-racor/15 bg-racor/5 px-4 py-3 text-xs text-neutral-600">
                Estás consultando sobre:{" "}
                <strong className="text-racor">{currentProduct.title}</strong>
              </div>
            )}

            {activeModeConfig && ActiveModeIcon && (
              <div className="flex items-center justify-between gap-3 border border-racor/15 bg-racor/5 px-4 py-3">
                <span className="inline-flex items-center gap-3 text-xs text-neutral-700">
                  <ActiveModeIcon className="size-4 text-racor" aria-hidden="true" />
                  <span>
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
                      Modo activo
                    </span>
                    <strong className="mt-0.5 block text-racor">{activeModeConfig.label}</strong>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={startNewConversation}
                  className="text-[9px] font-semibold uppercase tracking-[0.12em] text-racor underline underline-offset-4"
                >
                  Cambiar modo
                </button>
              </div>
            )}

            {messages.length === 1 && (
              <div className="order-last space-y-5 border-t border-neutral-200 pt-5">
            <section aria-labelledby="assistant-modes-title">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3
                  id="assistant-modes-title"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500"
                >
                  Elige cómo quieres empezar
                </h3>
                <span className="text-[10px] text-neutral-400">4 modos especializados</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ASSISTANT_MODES.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => startMode(mode)}
                      disabled={status !== "ready"}
                      className="group/mode flex min-h-28 items-start gap-3 border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-racor hover:bg-racor hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-racor/8 text-racor transition-colors group-hover/mode:bg-white group-hover/mode:text-racor">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-racor/70 transition-colors group-hover/mode:text-white/60">
                          {mode.eyebrow}
                        </span>
                        <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.04em]">
                          {mode.label}
                        </span>
                        <span className="mt-1.5 block text-[11px] font-normal leading-relaxed text-neutral-500 transition-colors group-hover/mode:text-white/75">
                          {mode.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

              </div>
            )}

            {activeMode === "catalog" && (
              <section aria-labelledby="assistant-products-title">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3
                    id="assistant-products-title"
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500"
                  >
                    Prendas recomendadas
                  </h3>
                  <Link
                    href="/prendas"
                    onClick={() => openProduct("/prendas")}
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] text-racor underline-offset-4 hover:underline"
                  >
                    Ver catálogo
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {featuredProducts.map((product) => (
                    <ProductRecommendationCard
                      key={product.handle}
                      product={product}
                      onOpen={openProduct}
                    />
                  ))}
                </div>
              </section>
            )}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2">
                    <RacorAssistantMark compact />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-racor">
                      RACOR
                    </span>
                  </div>
                )}
                <MessageContent
                  className={
                    message.role === "assistant"
                      ? "w-full border-l-2 border-racor/15 pl-4 text-[13px] leading-relaxed"
                      : "rounded-none border border-neutral-200 bg-neutral-100 text-[13px] leading-relaxed"
                  }
                >
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      message.role === "assistant" ? (
                        <MessageResponse
                          key={`${message.id}-${index}`}
                          components={{
                            a: ({ href = "", children, ...props }: ComponentProps<"a">) =>
                              href.startsWith("/") ? (
                                <Link
                                  href={href}
                                  {...props}
                                  onClick={() => openProduct(href)}
                                  className="font-semibold text-racor underline underline-offset-2"
                                >
                                  {children}
                                </Link>
                              ) : (
                                <a
                                  href={href}
                                  {...props}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() =>
                                    trackEvent("chat_external_click", {
                                      destination: href,
                                      product: contextHandle,
                                    })
                                  }
                                  className="font-semibold text-racor underline underline-offset-2"
                                >
                                  {children}
                                </a>
                              ),
                          } as Components}
                        >
                          {part.text}
                        </MessageResponse>
                      ) : (
                        <p key={`${message.id}-${index}`} className="whitespace-pre-wrap">
                          {part.text}
                        </p>
                      )
                    ) : null
                  )}
                </MessageContent>
              </Message>
            ))}

            {status === "submitted" && (
              <Message from="assistant">
                <div className="flex items-center gap-2">
                  <RacorAssistantMark compact />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-racor">
                    RACOR
                  </span>
                </div>
                <MessageContent className="flex-row items-center gap-2 border-l-2 border-racor/15 pl-4 text-xs text-neutral-500">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span role="status">Consultando la información de RACOR…</span>
                </MessageContent>
              </Message>
            )}

            {error && (
              <div className="border border-red-200 bg-red-50 p-3 text-xs text-red-800" role="alert">
                No he podido responder ahora. Prueba de nuevo o{" "}
                <Link href="/contacto" onClick={() => setOpen(false)} className="underline">
                  contacta con RACOR
                </Link>
                .
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton className="rounded-none" aria-label="Ir al último mensaje" />
        </Conversation>

        <div className="border-t border-neutral-200 bg-white px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
          {suggestions.length > 0 && (
            <Suggestions className="pb-3">
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  suggestion={suggestion}
                  onClick={ask}
                  disabled={status !== "ready"}
                  className="rounded-none border-neutral-300 text-[11px] font-semibold"
                />
              ))}
            </Suggestions>
          )}

          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder={
                activeModeConfig
                  ? `Escribe tu consulta para ${activeModeConfig.label.toLowerCase()}…`
                  : "Escribe tu consulta o elige un modo…"
              }
              aria-label="Pregunta para el asistente comercial"
              maxLength={500}
              className="min-h-14 text-sm"
            />
            <PromptInputFooter>
              <PromptInputTools>
                <span className="px-1 text-[10px] text-neutral-400">Enter para enviar</span>
              </PromptInputTools>
              <PromptInputSubmit
                status={status}
                onStop={stop}
                disabled={status === "ready" && !input.trim()}
                aria-label={status === "streaming" ? "Detener respuesta" : "Enviar pregunta"}
                className="rounded-none bg-racor text-white hover:bg-racor/90"
              />
            </PromptInputFooter>
          </PromptInput>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-10 items-center justify-center gap-2 border border-racor bg-racor px-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition-colors hover:bg-white hover:text-racor"
            >
              <MessageCircle className="size-3.5" aria-hidden="true" />
              Hablar con RACOR
            </Link>
            <a
              href="https://wa.me/34653224053?text=Hola%20RACOR%2C%20necesito%20ayuda%20con%20una%20equipaci%C3%B3n."
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackEvent("chat_external_click", {
                  destination: "whatsapp",
                  product: contextHandle,
                })
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 border border-neutral-300 px-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-neutral-800 transition-colors hover:border-racor hover:text-racor"
            >
              <MessageCircle className="size-3.5" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

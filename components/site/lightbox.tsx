"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import type { GalleryItem } from "@/lib/commerce/types";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.25;

interface Position {
  x: number;
  y: number;
}

interface DragState extends Position {
  pointerId: number;
  originX: number;
  originY: number;
}

interface LightboxCtx {
  open: (items: GalleryItem[], index: number) => void;
}

const Ctx = createContext<LightboxCtx | null>(null);

export function useLightbox() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLightbox debe usarse dentro de <LightboxProvider>");
  return ctx;
}

function ZoomableImage({ item }: { item: GalleryItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const constrainPosition = useCallback(
    (nextPosition: Position, nextScale: number): Position => {
      if (nextScale <= MIN_SCALE) return { x: 0, y: 0 };

      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return nextPosition;

      const maxX = (bounds.width * (nextScale - 1)) / 2;
      const maxY = (bounds.height * (nextScale - 1)) / 2;

      return {
        x: Math.max(-maxX, Math.min(maxX, nextPosition.x)),
        y: Math.max(-maxY, Math.min(maxY, nextPosition.y)),
      };
    },
    []
  );

  const applyScale = useCallback(
    (requestedScale: number) => {
      const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, requestedScale));
      setScale(nextScale);
      setPosition((currentPosition) =>
        constrainPosition(currentPosition, nextScale)
      );
    },
    [constrainPosition]
  );

  const resetView = useCallback(() => {
    setScale(MIN_SCALE);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    applyScale(scale + (event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (scale <= MIN_SCALE) return;

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setPosition(
      constrainPosition(
        {
          x: drag.originX + event.clientX - drag.x,
          y: drag.originY + event.clientY - drag.y,
        },
        scale
      )
    );
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full touch-none overflow-hidden ${
        scale > MIN_SCALE
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-zoom-in"
      }`}
      onDoubleClick={(event) => {
        event.stopPropagation();
        if (scale > MIN_SCALE) resetView();
        else applyScale(2);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onWheel={handleWheel}
    >
      <div
        className="pointer-events-none absolute inset-0 select-none will-change-transform"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
        }}
      >
        <Image
          src={item.src}
          alt={item.caption}
          fill
          sizes="92vw"
          draggable={false}
          className="object-contain"
        />
      </div>

      <div
        className="absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-neutral-950/75 p-1 text-white shadow-lg backdrop-blur"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Alejar imagen"
          disabled={scale <= MIN_SCALE}
          className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          onClick={() => applyScale(scale - SCALE_STEP)}
        >
          <Minus className="size-4" />
        </button>
        <span
          className="min-w-12 text-center text-[10px] font-medium tabular-nums"
          aria-live="polite"
        >
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          aria-label="Acercar imagen"
          disabled={scale >= MAX_SCALE}
          className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          onClick={() => applyScale(scale + SCALE_STEP)}
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Restablecer imagen"
          disabled={scale <= MIN_SCALE && position.x === 0 && position.y === 0}
          className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          onClick={resetView}
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((list: GalleryItem[], i: number) => {
    setItems(list);
    setIndex(i);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, prev, next]);

  const current = items[index];

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
          >
            <button
              type="button"
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-20 p-3 text-white/75 transition-opacity hover:text-white"
              onClick={close}
            >
              <X className="size-7" />
            </button>

            <button
              type="button"
              aria-label="Anterior"
              className="absolute left-1 top-1/2 z-20 -translate-y-1/2 p-3 text-white/75 hover:text-white md:left-4"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft className="size-8" />
            </button>

            <motion.div
              key={current.src}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative h-[82vh] w-[min(92vw,1100px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <ZoomableImage item={current} />
            </motion.div>

            <button
              type="button"
              aria-label="Siguiente"
              className="absolute right-1 top-1/2 z-20 -translate-y-1/2 p-3 text-white/75 hover:text-white md:right-4"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight className="size-8" />
            </button>

            <p className="absolute bottom-7 left-1/2 max-w-[90vw] -translate-x-1/2 text-center text-xs uppercase tracking-[0.14em] text-white">
              {current.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

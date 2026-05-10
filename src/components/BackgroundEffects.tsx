"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * ═══════════════════════════════════════════════════════════════
 * PUNTO 2 — Optimización GPU para Estética HUD
 * ═══════════════════════════════════════════════════════════════
 *
 * CAMBIOS APLICADOS:
 * 1. requestAnimationFrame para throttlear mousemove (60fps max)
 * 2. transform: translate3d() en lugar de translate() → fuerza GPU layer
 * 3. will-change: transform en elementos animados
 * 4. Desactivación del parallax en móvil (touch devices no usan cursor)
 * 5. contain: strict en wrappers para limitar el scope de repaint
 */
export default function BackgroundEffects() {
    const fogRef = useRef<HTMLDivElement>(null);
    const patternRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number>(0);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Cancelar frame anterior para evitar acumulación
        if (rafId.current) cancelAnimationFrame(rafId.current);

        rafId.current = requestAnimationFrame(() => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 2;

            if (fogRef.current) {
                // translate3d fuerza composición GPU (z=0 promueve a own layer)
                fogRef.current.style.transform = `translate3d(${xPos * 15}px, ${yPos * 15}px, 0) rotate(${xPos * 2}deg)`;
            }
            if (patternRef.current) {
                patternRef.current.style.transform = `translate3d(${xPos * -10}px, ${yPos * -10}px, 0)`;
            }
        });
    }, []);

    useEffect(() => {
        // Solo activar parallax en dispositivos con puntero (no móviles)
        const hasPointer = window.matchMedia("(hover: hover)").matches;
        if (!hasPointer) return;

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [handleMouseMove]);

    return (
        <>
            {/* contain: strict limita el área de repaint del browser */}
            <div className="fog-wrapper" style={{ contain: "strict" }}>
                <div ref={fogRef} className="fog-layer"></div>
            </div>
            <div ref={patternRef} className="background-pattern"></div>
            <div className="liquid-glass"></div>
            <div className="vignette"></div>
        </>
    );
}

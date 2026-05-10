import { useState, useEffect, useCallback } from "react";
import type { StoreApi, UseBoundStore } from "zustand";

/**
 * Hook reutilizable para detectar si el componente está montado en el cliente.
 * Evita hydration mismatches entre SSR y CSR.
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    return mounted;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * PUNTO 1 — Solución al Error de Hidratación con Zustand
 * ═══════════════════════════════════════════════════════════════
 *
 * PROBLEMA:
 * Zustand `persist` lee localStorage durante la hidratación del cliente.
 * El servidor renderiza con el estado por defecto (items: []), pero el
 * cliente intenta renderizar con el estado persistido (items: [...]),
 * provocando un mismatch de hidratación fatal.
 *
 * SOLUCIÓN:
 * Este hook retorna el valor por defecto (fallback) durante SSR y el
 * primer render del cliente. Solo después del montaje del componente
 * devuelve el estado real del store. Así Next.js hidrata sin conflictos.
 *
 * USO:
 * ```tsx
 * "use client";
 * import { useStore } from "@/lib/hooks";
 * import { useCartStore } from "@/lib/cart-store";
 *
 * function MyComponent() {
 *     const items = useStore(useCartStore, (s) => s.items) ?? [];
 *     const addItem = useStore(useCartStore, (s) => s.addItem);
 *     // `items` es [] durante SSR, se llena tras el montaje en cliente
 * }
 * ```
 */
export function useStore<T, F>(
    store: UseBoundStore<StoreApi<T>>,
    selector: (state: T) => F
): F | undefined {
    const storeValue = store(selector);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return hydrated ? storeValue : undefined;
}

/**
 * Hook de conveniencia para acceder al CartStore de forma segura.
 * Retorna valores por defecto estables durante SSR.
 *
 * USO:
 * ```tsx
 * const { items, totalItems, totalPrice, addItem, removeItem, ... } = useHydratedCart();
 * ```
 */
export function useHydratedCart() {
    // Importación dinámica para evitar dependencia circular
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useCartStore } = require("@/lib/cart-store");

    const storeState = useCartStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    // Valores seguros para SSR (coinciden con los defaults del store)
    const defaults = {
        items: [] as never[],
        isCartOpen: false,
        addItem: (() => {}) as typeof storeState.addItem,
        removeItem: (() => {}) as typeof storeState.removeItem,
        updateQuantity: (() => {}) as typeof storeState.updateQuantity,
        clearCart: () => {},
        openCart: () => {},
        closeCart: () => {},
        toggleCart: () => {},
        getTotalItems: () => 0,
        getTotalPrice: () => 0,
    };

    return hydrated ? storeState : defaults;
}

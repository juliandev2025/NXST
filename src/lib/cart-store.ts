import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    name: string;
    category: string;
    price: string;
    image: string;
    quantity: number;
    details: string;
}

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;

    // Actions
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    // Computed helpers (as functions since zustand doesn't have getters)
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            addItem: (item) => {
                const existing = get().items.find((i) => i.id === item.id);
                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    set({
                        items: [...get().items, { ...item, quantity: 1 }],
                    });
                }
                // Auto-open cart on add
                set({ isCartOpen: true });
            },

            removeItem: (id) => {
                set({
                    items: get().items.filter((i) => i.id !== id),
                });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),
            toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

            getTotalItems: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),

            getTotalPrice: () =>
                get().items.reduce((sum, i) => {
                    const price = parseFloat(i.price.replace("$", "").replace(",", ""));
                    return sum + price * i.quantity;
                }, 0),
        }),
        {
            name: "nxst-cart",
            // Only persist the items, not the open state
            partialize: (state) => ({ items: state.items }),
        }
    )
);

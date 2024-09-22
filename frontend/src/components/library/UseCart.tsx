import create from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/Product";

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product: Product) =>
        set((state) => {
          const existingProductIndex = state.cart.findIndex(
            (p) => p.id === product.id
          );
          if (existingProductIndex >= 0) {
            const updatedCart = state.cart.map((p, i) =>
              i === existingProductIndex
                ? { ...p, quantity: (p.quantity || 1) + 1 }
                : p
            );
            return { cart: updatedCart };
          } else {
            return { cart: [...state.cart, { ...product, quantity: 1 }] };
          }
        }),
      removeFromCart: (index: number) =>
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        })),
      updateQuantity: (index: number, delta: number) =>
        set((state) => {
          const updatedCart = state.cart
            .map((product, i) => {
              if (i === index) {
                return {
                  ...product,
                  quantity: (product.quantity || 1) + delta,
                };
              }
              return product;
            })
            .filter((product) => product.quantity > 0);

          return { cart: updatedCart };
        }),
    }),
    {
      name: "cart-storage", // Unique name for the storage
      getStorage: () => localStorage, // Specify the storage type
    }
  )
);

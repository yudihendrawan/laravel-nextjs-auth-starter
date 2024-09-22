import create from "zustand";

interface StoreState {
  isSidebarCheckoutOpen: boolean;
  toggleSidebarCheckout: () => void;
  counter: number;
  incrementCounter: () => void;
}

const useStore = create<StoreState>((set) => ({
  isSidebarCheckoutOpen: false,
  toggleSidebarCheckout: () =>
    set((state) => ({ isSidebarCheckoutOpen: !state.isSidebarCheckoutOpen })),

  counter: 0,
  incrementCounter: () => set((state) => ({ counter: state.counter + 1 })),
}));

export default useStore;

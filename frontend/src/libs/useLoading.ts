import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  isGlobalLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsGlobalLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  isGlobalLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setIsGlobalLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export default useLoadingStore;

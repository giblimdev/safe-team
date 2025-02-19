import { create } from "zustand";

interface FunctionalityState {
  selectedFunctionality: any | null;
  setSelectedFunctionality: (functionality: any | null) => void;
}

export const useFunctionalityStore = create<FunctionalityState>((set) => ({
  selectedFunctionality: null,
  setSelectedFunctionality: (functionality) => set({ selectedFunctionality: functionality }),
}));

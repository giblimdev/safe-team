import { create } from "zustand";

interface FunctionalityItemState {
  selectedFunctionalityItem: any | null;
  setSelectedFunctionalityItem: (item: any | null) => void;
}

export const useFunctionalityItemStore = create<FunctionalityItemState>((set) => ({
  selectedFunctionalityItem: null,
  setSelectedFunctionalityItem: (item) => set({ selectedFunctionalityItem: item }),
}));

import { create } from "zustand";

interface IdeaState {
  selectedIdea: any | null;
  setSelectedIdea: (idea: any | null) => void;
}

export const useIdeaStore = create<IdeaState>((set) => ({
  selectedIdea: null,
  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
}));

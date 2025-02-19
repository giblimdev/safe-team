// @/lib/store/useIdeaStore.ts
import { create } from 'zustand';

type Idea = {
  id: string;
  content: string;
  order: number;
};

type IdeaStore = {
  selectedIdea: Idea | null; 
  setSelectedIdea: (idea: Idea | null) => void;
  hoveredIdea: Idea | null;
  setHoveredIdea: (idea: Idea | null) => void;
};

export const useIdeaStore = create<IdeaStore>((set) => ({
  selectedIdea: null,
  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
  hoveredIdea: null,
  setHoveredIdea: (idea) => set({ hoveredIdea: idea }),
}));
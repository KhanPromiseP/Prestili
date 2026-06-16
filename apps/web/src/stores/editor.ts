import { create } from 'zustand';
import { Element, EditorState } from '@prestili/shared';

interface EditorStore extends EditorState {
  setPresentationId: (id: string | null) => void;
  setSelectedElements: (ids: string[]) => void;
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  removeElement: (id: string) => void;
  undo: () => void;
  redo: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentSlide: (id: string | null) => void;
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  savePresentation: () => void;
  loadPresentation: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  presentationId: null,
  selectedElements: [],
  clipboard: null,
  history: {
    past: [],
    present: null,
    future: [],
  },
  zoom: 1,
  pan: { x: 0, y: 0 },
  isPlaying: false,
  currentSlideId: null,

  setPresentationId: (id) => set({ presentationId: id }),

  setSelectedElements: (ids) => set({ selectedElements: ids }),

  addElement: (element) =>
    set((state) => {
      // If there's a current slide, add the element to that slide
      if (state.currentSlideId) {
        const slides = state.history.present?.slides || {};
        const currentSlide = slides[state.currentSlideId];
        if (currentSlide) {
          const newSlides = {
            ...slides,
            [state.currentSlideId]: {
              ...currentSlide,
              elements: [...(currentSlide.elements || []), element],
            },
          };
          return {
            history: {
              past: [...state.history.past, state.history.present],
              present: { ...state.history.present, slides: newSlides },
              future: [],
            },
          };
        }
      }
      
      // Fallback: add to global elements if no current slide
      const newElements = [...(state.history.present?.elements || []), element];
      return {
        history: {
          past: [...state.history.past, state.history.present],
          present: { ...state.history.present, elements: newElements },
          future: [],
        },
      };
    }),

  updateElement: (id, updates) =>
    set((state) => {
      const elements = state.history.present?.elements || [];
      const newElements = elements.map((el: Element) =>
        el.id === id ? { ...el, ...updates } : el
      );
      return {
        history: {
          past: [...state.history.past, state.history.present],
          present: { ...state.history.present, elements: newElements },
          future: [],
        },
      };
    }),

  removeElement: (id) =>
    set((state) => {
      const elements = state.history.present?.elements || [];
      const newElements = elements.filter((el: Element) => el.id !== id);
      return {
        history: {
          past: [...state.history.past, state.history.present],
          present: { ...state.history.present, elements: newElements },
          future: [],
        },
        selectedElements: state.selectedElements.filter((selId) => selId !== id),
      };
    }),

  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        history: {
          past: newPast,
          present: previous,
          future: [state.history.present, ...state.history.future],
        },
      };
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        history: {
          past: [...state.history.past, state.history.present],
          present: next,
          future: newFuture,
        },
      };
    }),

  setZoom: (zoom) => set({ zoom }),

  setPan: (pan) => set({ pan }),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setCurrentSlide: (id: string | null) => set({ currentSlideId: id }),

  addSlide: () =>
    set((state) => {
      const newSlideId = `slide-${Date.now()}`;
      const newSlides = {
        ...state.history.present?.slides,
        [newSlideId]: { elements: [], backgroundColor: '#ffffff' },
      };
      return {
        history: {
          past: [...state.history.past, state.history.present],
          present: { ...state.history.present, slides: newSlides },
          future: [],
        },
        currentSlideId: newSlideId,
      };
    }),

  deleteSlide: (id: string) =>
    set((state) => {
      const slides = state.history.present?.slides || {};
      const slideIds = Object.keys(slides);
      if (slideIds.length <= 1) return state; // Don't delete the last slide

      const newSlides = { ...slides };
      delete newSlides[id];

      // Set current slide to the next available slide
      const remainingSlideIds = Object.keys(newSlides);
      const newCurrentSlideId = remainingSlideIds[0] || null;

      return {
        history: {
          past: [...state.history.past, state.history.present],
          present: { ...state.history.present, slides: newSlides },
          future: [],
        },
        currentSlideId: state.currentSlideId === id ? newCurrentSlideId : state.currentSlideId,
      };
    }),

  savePresentation: () => {
    const state = useEditorStore.getState();
    const presentationData = {
      id: state.presentationId || `pres-${Date.now()}`,
      elements: state.history.present?.elements || [],
      slides: state.history.present?.slides || {},
      currentSlideId: state.currentSlideId,
      savedAt: new Date().toISOString(),
    };

    // Save to localStorage for now
    localStorage.setItem(`presentation_${presentationData.id}`, JSON.stringify(presentationData));
    console.log('Presentation saved:', presentationData.id);
  },

  loadPresentation: (id: string) => {
    const savedData = localStorage.getItem(`presentation_${id}`);
    if (savedData) {
      const presentationData = JSON.parse(savedData);
      useEditorStore.setState({
        presentationId: presentationData.id,
        history: {
          past: [],
          present: {
            elements: presentationData.elements,
            slides: presentationData.slides,
          },
          future: [],
        },
        currentSlideId: presentationData.currentSlideId,
      });
      console.log('Presentation loaded:', id);
    }
  },
}));

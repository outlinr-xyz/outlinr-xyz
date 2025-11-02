import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';

interface PreferencesState {
  presentationView: ViewMode;
  setPresentationView: (view: ViewMode) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      presentationView: 'grid',
      setPresentationView: (view) => set({ presentationView: view }),
    }),
    {
      name: 'outlinr-preferences',
    },
  ),
);

// Optimized selector
export const usePresentationView = () =>
  usePreferencesStore((state) => state.presentationView);

export const useSetPresentationView = () =>
  usePreferencesStore((state) => state.setPresentationView);

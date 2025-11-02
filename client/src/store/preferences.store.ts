import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';

interface PreferencesState {
  presentationView: ViewMode;
  setPresentationView: (view: ViewMode) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      presentationView: 'grid',
      setPresentationView: (view) => set({ presentationView: view }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'outlinr-preferences',
    },
  ),
);

// Optimized selectors
export const usePresentationView = () =>
  usePreferencesStore((state) => state.presentationView);

export const useSetPresentationView = () =>
  usePreferencesStore((state) => state.setPresentationView);

export const useSidebarOpen = () =>
  usePreferencesStore((state) => state.sidebarOpen);

export const useSetSidebarOpen = () =>
  usePreferencesStore((state) => state.setSidebarOpen);

export const useToggleSidebar = () =>
  usePreferencesStore((state) => state.toggleSidebar);

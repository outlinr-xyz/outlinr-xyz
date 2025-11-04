import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { appConfig } from '@/config/app';

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
      presentationView: appConfig.ui.defaultViewMode,
      setPresentationView: (view) => set({ presentationView: view }),
      sidebarOpen: appConfig.ui.sidebarDefaultOpen,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: appConfig.storage.preferencesKey,
    },
  ),
);

// Optimized selectors to prevent unnecessary re-renders
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

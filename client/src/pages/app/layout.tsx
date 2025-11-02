import { Suspense } from 'react';
import { Outlet } from 'react-router';

import PageLoader from '@/components/page-loader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useSetSidebarOpen, useSidebarOpen } from '@/store/preferences.store';

import AppNavbar from './_components/app-navbar';
import AppSidebar from './_components/app-sidebar';

const AppLayout = () => {
  const sidebarOpen = useSidebarOpen();
  const setSidebarOpen = useSetSidebarOpen();

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="w-full px-6">
          <AppNavbar />
          <div className="mt-2 w-full">
            <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-8 px-2 sm:px-6 lg:px-12 xl:px-16">
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;

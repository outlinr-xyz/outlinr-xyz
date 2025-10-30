import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import AppNavbar from './_components/app-navbar';
import AppSidebar from './_components/app-sidebar';
import Loading from './loading';

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="w-full px-6">
          <AppNavbar />
          <div className="mt-2 w-full">
            <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-8 px-2 sm:px-6 lg:px-12 xl:px-16">
              <Suspense fallback={<Loading />}>
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

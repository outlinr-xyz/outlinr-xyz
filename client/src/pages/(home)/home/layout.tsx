import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import AppSidebar from "./_components/app-sidebar";
import AppNavbar from "./_components/app-navbar";

export default function HomePageLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="!ml-0">
        <div className="px-6 w-full">
          <AppNavbar />
          <div className="w-full mt-2 md:mt-8">
            <div className="flex flex-col gap-8 w-full px-2 sm:px-6 lg:px-12 xl:px-16 max-w-7xl mx-auto mb-8">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

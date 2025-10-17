import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { cn, sidebarItems } from "@/lib/utils";

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="mt-3">
        <Link to="/home" className="no-underline text-current">
          <div className="flex flex-row items-center gap-2 h-14 justify-start py-3 px-2">
            <img src="/outlinr.webp" alt="outlinr logo" className="size-4" />
            <span
              className={cn(
                "text-2xl font-bold overflow-hidden",
                state === "collapsed" && "hidden",
              )}
            >
              Outlinr
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.top.map((item) => {
                let isActive = false;
                if (item.url === "/home")
                  isActive = pathname === "/home" || pathname === "/home/";
                else
                  isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "text-sm transition-all duration-300 my-1",
                        isActive &&
                          "text-[#254BF5] font-medium hover:text-[#254BF5] [&:hover]:text-[#254BF5]",
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span className="capitalize">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {sidebarItems.bottom.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url} className="opacity-60">
                  <item.icon />
                  <span className="capitalize">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

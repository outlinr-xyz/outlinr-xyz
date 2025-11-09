import { Loader2Icon, LogOutIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { useIsMobile } from '@/components/hooks/use-mobile';
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
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar.lib';
import { supabase } from '@/lib/supabase';
import { cn, sidebarItems } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const AppSidebar = () => {
  const clearAuth = useAuthStore((s) => s.clear);
  const navigate = useNavigate();
  const { state } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isMobile = useIsMobile();

  const handleLogout = async (url: string) => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      clearAuth();
      navigate(url);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="mt-3">
        <Link to="/app/home" className="text-current no-underline">
          <div className="flex h-14 flex-row items-center justify-start gap-2 px-2 py-3">
            <img src="/outlinr.webp" alt="outlinr logo" className="size-4" />
            <span
              className={cn(
                'overflow-hidden text-2xl font-bold',
                state === 'collapsed' && 'hidden',
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
                const isActive =
                  item.url === '/app/home'
                    ? pathname === '/app/home' || pathname === '/app/home/'
                    : pathname === item.url ||
                      pathname.startsWith(item.url + '/');

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        'my-1 text-sm transition-all duration-300',
                        isActive &&
                          'font-medium text-[#254BF5] hover:text-[#254BF5] [&:hover]:text-[#254BF5]',
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
      <SidebarFooter className="capitalize opacity-60">
        <SidebarMenu>
          {(state !== 'collapsed' || isMobile) &&
            sidebarItems.bottom.map((item) => {
              if (!item.url) return null;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <span className="text-xs">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={() => {
                handleLogout('/');
              }}
              disabled={isLoggingOut}
            >
              <div className="flex cursor-pointer">
                {isLoggingOut ? (
                  <Loader2Icon className="animate-spin text-sm" />
                ) : (
                  <LogOutIcon />
                )}
                <span className="text-xs">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

import { BellIcon } from 'lucide-react';

import { Kbd } from '@/components/ui/kbd';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AppNavbar = () => {
  return (
    <nav className="flex w-full items-center justify-between py-4">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <div className="hidden items-center gap-1 md:flex">
          <Kbd>⌘</Kbd>
          <Kbd>B</Kbd>
        </div>
      </div>

      <div className="flex h-16 flex-row items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="hover:bg-muted cursor-pointer rounded-md p-2">
              <BellIcon className="size-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
};

export default AppNavbar;

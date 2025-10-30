import { BellIcon, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AppNavbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const pathname = location.pathname;

  const { showSearchBar, placeholder } = useMemo(() => {
    const noSearchPaths = ['/app/home', '/app/home/'];
    const shouldShow = !noSearchPaths.includes(pathname);

    const context = pathname.split('/').pop() || '';
    const capitalizedContext =
      context.charAt(0).toUpperCase() + context.slice(1);
    const placeholderText = context
      ? `Search in ${capitalizedContext}`
      : 'Search...';

    return {
      showSearchBar: shouldShow,
      placeholder: placeholderText,
    };
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isModifierPressed = isMac ? e.metaKey : e.ctrlKey;
      if (isModifierPressed && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        {showSearchBar && (
          <div className="flex w-full max-w-xs flex-col gap-6">
            <ButtonGroup aria-label="Search control group">
              <InputGroup>
                <InputGroupInput ref={inputRef} placeholder={placeholder} />
                <InputGroupAddon
                  align="inline-start"
                  className="hidden space-x-1 md:inline-block"
                >
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </InputGroupAddon>
              </InputGroup>
              <Button variant="outline" aria-label="Search">
                <SearchIcon />
              </Button>
            </ButtonGroup>
          </div>
        )}
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

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export default function AppNavbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const pathname = location.pathname;

  const noSearchPaths = ["/home", "/home/"];
  const showSearchBar = !noSearchPaths.includes(pathname);

  const context = pathname.split("/").pop() || "";
  const capitalizedContext = context.charAt(0).toUpperCase() + context.slice(1);
  const placeholder = context ? `Search in ${capitalizedContext}` : "Search...";

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isModifierPressed = isMac ? e.metaKey : e.ctrlKey;
      if (isModifierPressed && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="flex items-center justify-between w-full py-4">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <div className="hidden md:flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>B</Kbd>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 h-16">
        {showSearchBar && (
          <div className="flex w-full max-w-xs flex-col gap-6">
            <ButtonGroup aria-label="Search control group">
              <InputGroup>
                <InputGroupInput ref={inputRef} placeholder={placeholder} />
                <InputGroupAddon
                  align="inline-start"
                  className="hidden md:inline-block space-x-1"
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
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={"#"} alt={"avatar"} />
          <AvatarFallback className="bg-[#254Bf5] text-white">
            {"OL"}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

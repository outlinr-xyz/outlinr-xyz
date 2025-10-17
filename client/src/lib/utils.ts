import { HelpCircle, Home, Inbox, Trash, User } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sidebarItems = {
  top: [
    {
      title: "home",
      url: "/home",
      icon: Home,
    },
    {
      title: "my presentations",
      url: "/home/presentations",
      icon: User,
    },
    {
      title: "shared with me",
      url: "/home/shared",
      icon: Inbox,
    },
    {
      title: "trash",
      url: "/home/trash",
      icon: Trash,
    },
  ],
  bottom: [
    {
      title: "support",
      url: "mailto:admin@outlinr.xyz",
      icon: HelpCircle,
    },
  ],
};

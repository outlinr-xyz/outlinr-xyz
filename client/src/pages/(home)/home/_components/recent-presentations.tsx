import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, MoreHorizontal } from "lucide-react";

const presentations = [
  {
    id: "1",
    name: "untitled 1",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
    updated_at: "25-09-09",
  },
  {
    id: "2",
    name: "untitled 2",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
    updated_at: "25-09-09",
  },
  {
    id: "3",
    name: "untitled 3",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
    updated_at: "25-09-09",
  },
  {
    id: "4",
    name: "untitled 4",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
    updated_at: "25-09-09",
  },
  {
    id: "5",
    name: "untitled 5",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
    updated_at: "25-09-09",
  },
];

export default function RecentPresentations() {
  return (
    <section>
      <h2 className="font-medium text-base mt-2 md:mt-8">Recently Viewed</h2>
      <div className="w-full max-w-6xl">
        <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
          {presentations.map((presentation) => (
            <Item
              key={presentation.id}
              style={{ backgroundImage: `url(${presentation.image})` }}
              className="relative aspect-square rounded-lg bg-cover bg-center overflow-hidden"
            >
              <Link
                to={`/home/presentation/${presentation.id}/analytics`}
                className="absolute top-2 left-2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white"
              >
                <LineChart className="h-4 w-4" />
              </Link>
              <button className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white">
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <Link
                to={`/presentation/${presentation.id}`}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 text-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                      <AvatarImage src={"#"} alt={"avatar"} />
                      <AvatarFallback className="bg-[#254bf5]">
                        OL
                      </AvatarFallback>
                    </Avatar>
                    <ItemContent className="min-w-0">
                      <ItemTitle className="truncate text-sm sm:text-base capitalize">
                        {presentation.name}
                      </ItemTitle>
                      <ItemDescription className="truncate text-xs sm:text-sm text-gray-300">
                        <span className="hidden lg:inline">Edited: </span>
                        {presentation.updated_at}
                      </ItemDescription>
                    </ItemContent>
                  </div>
                </div>
              </Link>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </section>
  );
}

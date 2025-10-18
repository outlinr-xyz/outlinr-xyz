import { Button } from "@/components/ui/button";
import { Plus, Sparkle } from "lucide-react";
import PopularFeatures from "./_components/popular-features";
import RecentPresentations from "./_components/recent-presentations";

export default function HomeIndexPage() {
  return (
    <>
      <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl">
        Welcome, David!
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        <Button className="rounded-full px-4 sm:px-6 py-2 flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" /> New Outline
        </Button>
        <Button
          className="rounded-full px-4 sm:px-6 py-2 flex items-center gap-2 cursor-pointer"
          variant="outline"
          disabled
        >
          <Sparkle className="h-4 w-4" /> Start with AI
        </Button>
      </div>
      <PopularFeatures />
      <RecentPresentations />
    </>
  );
}

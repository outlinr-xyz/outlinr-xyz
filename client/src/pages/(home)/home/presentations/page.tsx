import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PresentationsPage() {
  return (
    <>
      <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl">
        My Presentations
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
          <Plus className="h-4 w-4" /> New Folder
        </Button>
      </div>
    </>
  );
}

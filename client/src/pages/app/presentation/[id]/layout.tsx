import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

import { updateLastOpened } from "@/lib/api/presentations";

import PresentationNavbar from "./_components/presentation-navbar";

export default function PresentationLayout() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      updateLastOpened(id);
    }
  }, [id]);

  return (
    <div>
      <PresentationNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

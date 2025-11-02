import { Outlet } from "react-router";

import PresentationNavbar from "./_components/presentation-navbar";

export default function PresentationLayout() {
  return (
    <div>
      <PresentationNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

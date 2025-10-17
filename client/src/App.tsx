import { Route, Routes } from "react-router";
import PresentationPage from "./pages/(app)/presentation/page";
import NotFoundPage from "./pages/not-found/page";
import LandingPage from "./pages/(landing)/landing/page";
import DashboardPageLayout from "./pages/(home)/home/layout";
import DashboardIndexPage from "./pages/(home)/home/page";
import PresentationsPage from "./pages/(home)/home/presentations/page";
import TrashPage from "./pages/(home)/home/trash/page";
import SharedPage from "./pages/(home)/home/shared/page";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<DashboardPageLayout />}>
        <Route index element={<DashboardIndexPage />} />
        <Route path="presentations" element={<PresentationsPage />} />
        <Route path="trash" element={<TrashPage />} />
        <Route path="shared" element={<SharedPage />} />
      </Route>
      <Route
        path="/presentation/:presentationId"
        element={<PresentationPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

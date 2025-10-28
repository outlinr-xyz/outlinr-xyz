import { Navigate, Outlet, Route, Routes } from 'react-router';

import { ProtectedRoute } from './components/protected-routes';
import ComparisonPage from './pages/(public)/comparison/page';
import PublicLayout from './pages/(public)/layout';
import PublicPage from './pages/(public)/page';
import PricingPage from './pages/(public)/pricing/page';
import DashboardPage from './pages/app/(home)/dashboard/page';
import HomePage from './pages/app/(home)/home/page';
import SharedWithMePage from './pages/app/(home)/shared-with-me/page';
import TemplatesPage from './pages/app/(home)/templates/page';
import TrashPage from './pages/app/(home)/trash/page';
import WorkSpacePage from './pages/app/(home)/workspace/page';
import AppLayout from './pages/app/layout';
import NotFoundPage from './pages/app/not-found';
import JoinPage from './pages/app/presentation/[id]/join/page';
import PresentationLayout from './pages/app/presentation/[id]/layout';
import PresentPage from './pages/app/presentation/[id]/present/page';
import PreviewPage from './pages/app/presentation/[id]/preview/page';
import QuestionPage from './pages/app/presentation/[id]/question/page';
import ResultsPage from './pages/app/presentation/[id]/results/page';
import AuthLayout from './pages/auth/layout';
import LoginPage from './pages/auth/login/page';
import SignupPage from './pages/auth/sign-up/page';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/comparison" element={<ComparisonPage />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignupPage />} />
      </Route>
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="workspace" element={<WorkSpacePage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="shared-with-me" element={<SharedWithMePage />} />
        <Route path="trash" element={<TrashPage />} />
      </Route>
      <Route
        path="/app/presentation"
        element={
          <ProtectedRoute>
            <div style={{ width: '100%', height: '100%' }}>
              <Outlet />
            </div>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/home" replace />} />

        <Route path=":id" element={<PresentationLayout />}>
          <Route index element={<QuestionPage />} />
          <Route path="question" element={<QuestionPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="preview" element={<PreviewPage />} />
          <Route path="present" element={<PresentPage />} />
          <Route path="join" element={<JoinPage />} />
        </Route>
      </Route>
      s
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

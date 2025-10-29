import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';

import { ProtectedRoute } from './components/protected-routes';

// Lazy load all page components
const PublicLayout = lazy(() => import('./pages/(public)/layout'));
const PublicPage = lazy(() => import('./pages/(public)/page'));
const PricingPage = lazy(() => import('./pages/(public)/pricing/page'));
const ComparisonPage = lazy(() => import('./pages/(public)/comparison/page'));

const AuthLayout = lazy(() => import('./pages/auth/layout'));
const LoginPage = lazy(() => import('./pages/auth/login/page'));
const SignupPage = lazy(() => import('./pages/auth/sign-up/page'));

const AppLayout = lazy(() => import('./pages/app/layout'));
const HomePage = lazy(() => import('./pages/app/(home)/home/page'));
const DashboardPage = lazy(() => import('./pages/app/(home)/dashboard/page'));
const WorkSpacePage = lazy(() => import('./pages/app/(home)/workspace/page'));
const TemplatesPage = lazy(() => import('./pages/app/(home)/templates/page'));
const SharedWithMePage = lazy(
  () => import('./pages/app/(home)/shared-with-me/page'),
);
const TrashPage = lazy(() => import('./pages/app/(home)/trash/page'));

const PresentationLayout = lazy(
  () => import('./pages/app/presentation/[id]/layout'),
);
const QuestionPage = lazy(
  () => import('./pages/app/presentation/[id]/question/page'),
);
const ResultsPage = lazy(
  () => import('./pages/app/presentation/[id]/results/page'),
);
const PreviewPage = lazy(
  () => import('./pages/app/presentation/[id]/preview/page'),
);
const PresentPage = lazy(
  () => import('./pages/app/presentation/[id]/present/page'),
);
const JoinPage = lazy(() => import('./pages/app/presentation/[id]/join/page'));

const NotFoundPage = lazy(() => import('./pages/app/not-found'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

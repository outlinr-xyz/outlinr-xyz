import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { Navigate } from 'react-router';

import { ProtectedRoute } from '@/components/protected-routes';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Lazy-loaded page components
 */
// Public pages
const PublicLayout = lazy(() => import('@/pages/(public)/layout'));
const PublicPage = lazy(() => import('@/pages/(public)/page'));
const PricingPage = lazy(() => import('@/pages/(public)/pricing/page'));
const ComparisonPage = lazy(() => import('@/pages/(public)/comparison/page'));

// Auth pages
const AuthLayout = lazy(() => import('@/pages/auth/layout'));
const LoginPage = lazy(() => import('@/pages/auth/login/page'));
const SignupPage = lazy(() => import('@/pages/auth/sign-up/page'));

// App pages
const AppLayout = lazy(() => import('@/pages/app/layout'));
const HomePage = lazy(() => import('@/pages/app/(home)/home/page'));
const DashboardPage = lazy(() => import('@/pages/app/(home)/dashboard/page'));
const WorkSpacePage = lazy(() => import('@/pages/app/(home)/workspace/page'));
const TemplatesPage = lazy(() => import('@/pages/app/(home)/templates/page'));
const SharedWithMePage = lazy(
  () => import('@/pages/app/(home)/shared-with-me/page'),
);
const TrashPage = lazy(() => import('@/pages/app/(home)/trash/page'));

// Presentation pages
const PresentationLayout = lazy(
  () => import('@/pages/app/presentation/[id]/layout'),
);
const QuestionPage = lazy(
  () => import('@/pages/app/presentation/[id]/question/page'),
);
const ResultsPage = lazy(
  () => import('@/pages/app/presentation/[id]/results/page'),
);
const PreviewPage = lazy(
  () => import('@/pages/app/presentation/[id]/preview/page'),
);
const PresentPage = lazy(
  () => import('@/pages/app/presentation/[id]/present/page'),
);
const JoinPage = lazy(() => import('@/pages/app/presentation/[id]/join/page'));

// Error pages
const NotFoundPage = lazy(() => import('@/pages/app/not-found'));

/**
 * Public routes configuration
 */
const publicRoutes: RouteObject = {
  element: <PublicLayout />,
  children: [
    {
      path: ROUTES.PUBLIC.HOME,
      element: <PublicPage />,
    },
    {
      path: ROUTES.PUBLIC.PRICING,
      element: <PricingPage />,
    },
    {
      path: ROUTES.PUBLIC.COMPARISON,
      element: <ComparisonPage />,
    },
  ],
};

/**
 * Authentication routes configuration
 */
const authRoutes: RouteObject = {
  path: ROUTES.AUTH.BASE,
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="login" replace />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'sign-up',
      element: <SignupPage />,
    },
  ],
};

/**
 * Protected app routes configuration
 */
const appRoutes: RouteObject = {
  path: ROUTES.APP.BASE,
  element: (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="home" replace />,
    },
    {
      path: 'home',
      element: <HomePage />,
    },
    {
      path: 'dashboard',
      element: <DashboardPage />,
    },
    {
      path: 'workspace',
      element: <WorkSpacePage />,
    },
    {
      path: 'templates',
      element: <TemplatesPage />,
    },
    {
      path: 'shared-with-me',
      element: <SharedWithMePage />,
    },
    {
      path: 'trash',
      element: <TrashPage />,
    },
  ],
};

/**
 * Protected presentation routes configuration
 */
const presentationRoutes: RouteObject = {
  path: ROUTES.PRESENTATION.BASE,
  element: (
    <ProtectedRoute>
      <div style={{ width: '100%', height: '100%' }}>
        <Navigate to={ROUTES.APP.HOME} replace />
      </div>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <Navigate to={ROUTES.APP.HOME} replace />,
    },
    {
      path: ':id',
      element: <PresentationLayout />,
      children: [
        {
          index: true,
          element: <QuestionPage />,
        },
        {
          path: 'question',
          element: <QuestionPage />,
        },
        {
          path: 'results',
          element: <ResultsPage />,
        },
        {
          path: 'preview',
          element: <PreviewPage />,
        },
        {
          path: 'present',
          element: <PresentPage />,
        },
        {
          path: 'join',
          element: <JoinPage />,
        },
      ],
    },
  ],
};

/**
 * Catch-all route for 404 pages
 */
const notFoundRoute: RouteObject = {
  path: '*',
  element: <NotFoundPage />,
};

/**
 * Complete route configuration
 * Exported as an array of route objects for react-router
 */
export const routeConfig: RouteObject[] = [
  publicRoutes,
  authRoutes,
  appRoutes,
  presentationRoutes,
  notFoundRoute,
];

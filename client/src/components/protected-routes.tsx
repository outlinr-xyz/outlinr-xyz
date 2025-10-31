import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

import PageLoader from './page-loader';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/login?redirectTo=${redirectTo}`} replace />;
  }
  return children;
};

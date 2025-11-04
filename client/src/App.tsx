import { Suspense } from 'react';
import { useRoutes } from 'react-router';

import PageLoader from './components/page-loader';
import { routeConfig } from './routes';

/**
 * Main App component
 * Renders routes using centralized configuration
 */
export default function App() {
  const routes = useRoutes(routeConfig);

  return <Suspense fallback={<PageLoader />}>{routes}</Suspense>;
}

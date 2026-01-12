import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';

import { Analytics } from './components/Analytics';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { ScrollToTop } from './components/ScrollToTop';
import { SeoManager } from './components/SeoManager';
import { ThemeProvider } from './contexts/ThemeProvider';
import { ToolHistoryProvider } from './contexts/ToolHistoryContext';
import { routes } from './routes';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToolHistoryProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Analytics />
            <SeoManager />
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <AppRoutes />
              </Suspense>
            </ErrorBoundary>
          </Layout>
        </BrowserRouter>
      </ToolHistoryProvider>
    </ThemeProvider>
  );
};

export default App;

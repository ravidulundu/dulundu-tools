


import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Analytics } from './components/Analytics';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { SeoManager } from './components/SeoManager';
import { routes } from './routes';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Analytics />
        <SeoManager />
        <Suspense fallback={<Loading />}>
          <AppRoutes />
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;

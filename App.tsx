


import React, { Suspense } from 'react';
import { HashRouter, useRoutes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Loading } from './components/Loading';
import { routes } from './routes';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <AppRoutes />
        </Suspense>
      </Layout>
    </HashRouter>
  );
};

export default App;

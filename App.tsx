import React, { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { Analytics } from "./components/Analytics";
import { Layout } from "./components/Layout";
import { Loading } from "./components/Loading";
import { ScrollToTop } from "./components/ScrollToTop";
import { SeoManager } from "./components/SeoManager";
import { ThemeProvider } from "./contexts/ThemeContext";
import { routes } from "./routes";

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <Layout>
          <Analytics />
          <SeoManager />
          <Suspense fallback={<Loading />}>
            <AppRoutes />
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

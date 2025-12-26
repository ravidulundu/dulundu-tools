import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <h1 className="mb-4 text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="mb-6 text-foreground-secondary">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary-hover"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-8 max-w-2xl overflow-auto rounded bg-background-secondary p-4 text-left text-sm text-danger">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

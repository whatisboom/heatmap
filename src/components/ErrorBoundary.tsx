import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>🚨 Something went wrong</h2>
            <p>
              An unexpected error occurred while rendering the application.
            </p>
            {this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error.message}</pre>
                {this.state.error.stack && (
                  <pre className="error-stack">{this.state.error.stack}</pre>
                )}
              </details>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="retry-button"
            >
              Try Again
            </button>
            <button onClick={() => window.location.reload()} className="reload-button">
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
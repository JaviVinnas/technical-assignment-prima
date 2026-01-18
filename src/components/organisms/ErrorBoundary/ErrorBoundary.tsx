import { Component, type ReactNode } from "react";

import { ErrorState } from "../ErrorState";

/**
 * Error boundary component for catching JavaScript errors in child component tree.
 *
 * NOTE: This component uses a class component pattern, which is an exception to
 * the project's "functional components only" rule. React Error Boundaries currently
 * require the class component API as there is no hooks-based alternative available.
 * This is the only acceptable use of class components in this codebase.
 *
 * Catches unhandled errors during rendering, in lifecycle methods, and in
 * constructors of child components. Displays a fallback UI when an error occurs
 * instead of crashing the entire application.
 *
 * @param props - ErrorBoundary configuration
 * @param props.children - Child components to wrap with error boundary
 * @param props.fallback - Optional custom fallback component to display on error
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          message="Something went wrong. Please refresh the page or try again."
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

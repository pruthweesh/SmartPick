import React, { Component } from 'react';
import { EmptyState } from './EmptyState.jsx';

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <EmptyState
            type="server-error"
            title="Application Encountered an Error"
            description="A rendering or unexpected client exception occurred while executing this component."
            details={
              this.state.error?.message
                ? `System details: ${this.state.error.message}`
                : 'Try refreshing your browser session or reloading the application.'
            }
            actionText="Reload Application"
            onAction={() => window.location.reload()}
            secondaryActionText="Go to Homepage"
            secondaryActionHref="/"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

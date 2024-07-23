import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import { BaseLayout } from './layout/BaseLayout';
import { ErrorInfo } from 'react';
import { ErrorFallback } from './shared/components/ErrorFallback';

const logError = (error: Error, info: ErrorInfo) => {
  console.info(error.message, info);
};

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <BaseLayout />
    </ErrorBoundary>
  );
}



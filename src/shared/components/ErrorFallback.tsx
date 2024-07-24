import { useErrorBoundary } from 'react-error-boundary';

export const ErrorFallback = ({ error }: any) => {
  const { resetBoundary } = useErrorBoundary();

  // TODO: create UI for errors
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetBoundary}>Try again</button>
    </div>
  );
}
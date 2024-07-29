import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./core/auth/ProtectedRoute";
import { App } from "./App";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./shared/components/ErrorFallback";
import { ErrorInfo } from "react";


const logError = (error: Error, info: ErrorInfo) => {
  console.info(error.message, info);
};



export const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/profile',
            element: <Profile />,
          }
        ]
      },
    ],
  },
  {
    path: '/sign-in',
    element: <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}><SignIn /></ErrorBoundary>
  },
  {
    path: '/sign-up',
    element: <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}><SignUp /></ErrorBoundary>
  },
  {
    path: '/forgot-password',
    element: <div>Forgot Password here</div>
  },
  {
    path: '*',
    element: <p>404 Error - Nothing here...</p>
  }
]);

import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./core/auth/ProtectedRoute";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import AppContextProvider from "./core/context/AppContext";

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
            path: '/test',
            element: <div>test route here</div>,
          }
        ]
      },
    ],
  },
  {
    path: '/sign-in',
    element: <SignIn />
  },
  {
    path: '/sign-up',
    element: <SignUp />
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

import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./core/auth/ProtectedRoute";
import { App } from "./App";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";


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

import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext);
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

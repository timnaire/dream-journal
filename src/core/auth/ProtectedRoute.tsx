import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Loading } from '../../shared/components/Loading';

export function ProtectedRoute() {
    const { isAuthenticated, loading } = useContext(AppContext);

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

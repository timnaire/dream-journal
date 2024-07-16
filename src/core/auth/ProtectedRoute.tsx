import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useContext(AppContext);
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
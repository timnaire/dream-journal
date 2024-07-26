import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useApi } from '../../shared/hooks/useApi';

export function ProtectedRoute() {
    const { isAuthenticated, setAppState } = useContext(AppContext);
    const { httpPost } = useApi();
    console.log('running validate token');
    if (!isAuthenticated) {
        try {
            httpPost('/auth/validate-token', {}).then(res => {
                if (res && typeof res === 'object' && 'isAuthenticated' in res) {
                    setAppState({ isAuthenticated: true });
                }
            });
        } catch (error: any) {
            throw new Error('An error occured while validating user authentication:', error);
        }
    }

    // TODO: Have to fix redirect when page refresh
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

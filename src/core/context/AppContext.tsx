import { createContext, useState } from 'react';
import { useApi } from '../../shared/hooks/useApi';
import { Navigate } from 'react-router-dom';

export interface UserProps {
    firstName: string;
    lastName: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AppState {
    user?: UserProps;
    isAuthenticated?: boolean;
    setAppState: (newState: Partial<AppState>) => void
}

const defaultState: AppState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
    setAppState: (newState?: Partial<AppState>) => { },
}

export const AppContext = createContext<AppState>(defaultState);

export function AppContextProvider({ children }: any) {
    const [state, setState] = useState<AppState>(defaultState);
    const { httpPost } = useApi();

    const setAppState = (newState: Partial<AppState>) => {
        setState({ ...state, ...newState });
    }

    const exceptedRouteValidation = ['/sign-in', '/sign-up', 'forgot-password'];
    const willValidate = !exceptedRouteValidation.some(route => route === window.location.pathname);
    console.log(willValidate);
    if (willValidate) {
        try {
            httpPost('/auth/validate-token', {}).then(res => {
                console.log('called me first');
                if (res && typeof res === 'object' && 'isAuthenticated' in res) {
                    localStorage.setItem('isAuthenticated', 'true');
                    <Navigate to="/" replace />;
                }
            });
        } catch (error: any) {
            throw new Error('An error occured while validating user authentication:', error);
        }
    }

    console.log('state', state);

    return (
        <AppContext.Provider value={{ ...state, setAppState }}>
            {children}
        </AppContext.Provider>
    );
}
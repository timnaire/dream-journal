import { createContext, useState } from 'react';
import { useApi } from '../../shared/hooks/useApi';

export interface UserProps {
    firstname: string;
    lastname: string;
    fullname: string;
    email: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AppState {
    loading: boolean,
    user?: UserProps;
    isAuthenticated?: boolean;
    setAppState: (newState: Partial<AppState>) => void
}

const defaultState: AppState = {
    loading: true,
    isAuthenticated: false,
    setAppState: (newState?: Partial<AppState>): void => { },
}

export const AppContext = createContext<AppState>(defaultState);

export function AppContextProvider({ children }: any) {
    const [state, setState] = useState<AppState>(defaultState);
    const { httpPost } = useApi();

    const setAppState = (newState: Partial<AppState>): void => {
        setState((prev) => {
            return { ...prev, ...newState };
        });
    }

    const exceptedRouteValidation = ['/sign-in', '/sign-up', 'forgot-password'];
    const willValidate = !exceptedRouteValidation.some(route => route === window.location.pathname);

    if (willValidate && state.loading) {
        try {
            httpPost<{ isAuthenticated: boolean, user: UserProps }>('/auth/validate-token', {})
                .then(res => {
                    if (res && typeof res === 'object' && 'isAuthenticated' in res) {
                        setAppState({ isAuthenticated: res.isAuthenticated, user: res.user });
                    }
                }).finally(() => {
                    setAppState({ loading: false });
                });
        } catch (error: any) {
            throw new Error('An error occured while validating user authentication:', error);
        }
    }

    return (
        <AppContext.Provider value={{ ...state, setAppState }}>
            {children}
        </AppContext.Provider>
    );
}
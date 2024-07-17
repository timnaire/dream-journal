import { createContext, useEffect, useState } from "react";

export interface UserProps {
    firstName: string;
    lastName: string;
}

/**
 * Application state interface
 */
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
    const [state, setState] = useState(defaultState);

    const setAppState = (newState: Partial<AppState>) => {
        setState({ ...state, ...newState });
    }

    return (
        <AppContext.Provider value={{ ...state, setAppState }}>
            {children}
        </AppContext.Provider>
    );
}
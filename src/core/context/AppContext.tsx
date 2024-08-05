import { createContext, useEffect, useState } from 'react';
import { useApi } from '../../shared/hooks/useApi';
import { UserModel } from '../../shared/models/user';

export interface AppState {
  loading: boolean;
  user?: UserModel;
  isAuthenticated?: boolean;
  setAppState: (newState: Partial<AppState>) => void;
}

const defaultState: AppState = {
  loading: true,
  isAuthenticated: false,
  setAppState: (newState?: Partial<AppState>): void => {},
};

export const AppContext = createContext<AppState>(defaultState);

export function AppContextProvider({ children }: any) {
  const [state, setState] = useState<AppState>(defaultState);
  const { httpPost } = useApi();

  const setAppState = (newState: Partial<AppState>): void => {
    setState((prev) => {
      return { ...prev, ...newState };
    });
  };

  const exceptedRouteValidation = ['/sign-in', '/sign-up', '/forgot-password'];
  const willValidate = !exceptedRouteValidation.some((route) => route === window.location.pathname);

  useEffect(() => {
    if (willValidate && state.loading) {
      try {
        httpPost<{ isAuthenticated: boolean; user: UserModel }>('/auth/validate-token', {})
          .then((res) => {
            if (res && typeof res === 'object' && 'isAuthenticated' in res) {
              setAppState({ isAuthenticated: res.isAuthenticated, user: res.user });
            }
          })
          .finally(() => {
            setAppState({ loading: false });
          });
      } catch (error: any) {
        throw new Error('An error occured while validating user authentication:', error);
      }
    }
  }, []);

  return <AppContext.Provider value={{ ...state, setAppState }}>{children}</AppContext.Provider>;
}

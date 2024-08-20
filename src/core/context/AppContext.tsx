import { createContext, useEffect, useState } from 'react';
import { useApi } from '../../shared/hooks/useApi';
import { UserModel } from '../../shared/models/user';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { isTrue } from '../../shared/utils/is-true';

export interface AppState {
  loading: boolean;
  user?: UserModel;
  isAuthenticated?: boolean;
  isDarkMode?: boolean;
  theme: Theme;
  setAppState: (newState: Partial<AppState>) => void;
}

const rootElement = document.getElementById('root');
const getThemeColor = (isDark: boolean): Theme => {
  const colorScheme = createTheme({
    components: {
      MuiModal: {
        defaultProps: {
          container: rootElement,
        },
      },
    },
    palette: {
      // primary: { main: '#1976d2' },
      // secondary: { main: '#378FE7' },
      // text: {
      //   primary: isDark ? '#ffffff' : '#000',
      // },
      mode: isDark ? 'dark' : 'light',
    },
    breakpoints: {
      values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
    },
    spacing: 8,
    typography: {
      fontFamily: ['Montserrat', 'OpenSans', 'Arial', 'sans-serif'].join(','),
      fontSize: 14,
    },
  });

  return colorScheme;
};

const defaultState: AppState = {
  loading: true,
  isAuthenticated: false,
  isDarkMode: localStorage.getItem('isDarkMode') ? isTrue(localStorage.getItem('isDarkMode') ?? false) : undefined,
  theme: getThemeColor(isTrue(localStorage.getItem('isDarkMode') ?? false)),
  setAppState: (newState?: Partial<AppState>): void => {},
};

export const AppContext = createContext<AppState>(defaultState);

interface AppContextProviderProps {
  children: React.ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [state, setState] = useState<AppState>(defaultState);
  const { httpPost } = useApi();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    if (state.isDarkMode === undefined) {
      localStorage.setItem('isDarkMode', String(prefersDarkMode));
    }
    setAppState({ theme: getThemeColor(state.isDarkMode ?? false) });
  }, [state.isDarkMode, prefersDarkMode]);

  const setAppState = (newState: Partial<AppState>): void => {
    setState((prev) => {
      return { ...prev, ...newState };
    });
  };

  const exceptedRouteValidation = ['/sign-in', '/sign-up', '/forgot-password'];
  const willValidate = !exceptedRouteValidation.some((route) => route === window.location.pathname);

  if (willValidate && state.loading) {
    try {
      httpPost<{ isAuthenticated: boolean; user: UserModel }>('/auth/validate-token', {})
        .then((res) => {
          if (res && typeof res === 'object' && 'isAuthenticated' in res) {
            setAppState({
              isAuthenticated: res.isAuthenticated,
              user: res.user,
              theme: getThemeColor(state.isDarkMode ?? false),
            });
          }
        })
        .finally(() => {
          setAppState({ loading: false });
        });
    } catch (error: any) {
      throw new Error('An error occured while validating user authentication:', error);
    }
  }

  return (
    <ThemeProvider theme={state.theme}>
      <AppContext.Provider value={{ ...state, setAppState }}>{children}</AppContext.Provider>
    </ThemeProvider>
  );
}

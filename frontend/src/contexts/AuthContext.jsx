import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client";

const AUTH_STORAGE_KEY = "assignment1-auth";
const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      return { token: "", user: null };
    }

    const parsedValue = JSON.parse(storedValue);
    return {
      token: parsedValue.token || "",
      user: parsedValue.user || null
    };
  } catch (error) {
    return { token: "", user: null };
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(readStoredAuth);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(readStoredAuth().token));

  useEffect(() => {
    if (!authState.token) {
      setIsBootstrapping(false);
      return undefined;
    }

    let isMounted = true;

    async function syncCurrentUser() {
      try {
        const response = await authApi.me(authState.token);

        if (!isMounted) {
          return;
        }

        const nextState = {
          token: authState.token,
          user: response.data
        };

        setAuthState(nextState);
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState({ token: "", user: null });
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    syncCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [authState.token]);

  function persistAuth(data) {
    const nextState = {
      token: data.token,
      user: data.user
    };

    setAuthState(nextState);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
  }

  async function login(payload) {
    const response = await authApi.login(payload);
    persistAuth(response.data);
    return response;
  }

  async function register(payload) {
    const response = await authApi.register(payload);
    persistAuth(response.data);
    return response;
  }

  function logout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({ token: "", user: null });
  }

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        user: authState.user,
        isAuthenticated: Boolean(authState.token && authState.user),
        isBootstrapping,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}


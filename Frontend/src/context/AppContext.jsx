import { createContext, useContext, useMemo, useRef, useState } from "react";
import { createApiClient, DEFAULT_BASE_URL } from "../api/client";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const tokenRef = useRef(null);
  const baseUrlRef = useRef(baseUrl);
  tokenRef.current = token;
  baseUrlRef.current = baseUrl;

  const api = useMemo(
    () => createApiClient(() => baseUrlRef.current, () => tokenRef.current),
    []
  );

  const isAuthed = Boolean(token);

  function login(accessToken, userEmail) {
    setToken(accessToken);
    setEmail(userEmail);
  }

  function logout() {
    setToken(null);
    setEmail(null);
  }

  const value = {
    baseUrl,
    setBaseUrl,
    isAuthed,
    email,
    login,
    logout,
    api,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

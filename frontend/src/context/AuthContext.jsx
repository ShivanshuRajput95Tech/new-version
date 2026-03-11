/* eslint-disable react-refresh/only-export-components */

import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(Cookies.get("authToken"));
  });

  /* Check authentication on mount */

  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsAuthenticated(Boolean(token));
  }, []);

  const login = (token) => {
    Cookies.set("authToken", token, { expires: 7 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
  };

  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout
  }), [isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
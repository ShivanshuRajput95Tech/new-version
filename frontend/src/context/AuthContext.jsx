/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const setAuthenticated = (value) => {
    setIsAuthenticated(value);
  };

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data);
      setAuthenticated(true);
    } catch {
      setUser(null);
      setAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore network errors and still clear client state
    }
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuthenticated, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

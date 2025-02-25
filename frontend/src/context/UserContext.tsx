"use client";

import { createContext, useContext, useState, useEffect } from "react";

// 🎯 Interface für den User-Context
interface UserContextType {
  role: string;
  setRole: (role: string) => void;
  username: string | null;
  password: string | null;
  setCredentials: (username: string | null, password: string | null) => void;
}

// 📌 Context erstellen
const UserContext = createContext<UserContextType | undefined>(undefined);

// 🎯 Provider-Komponente
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string>(() => {
    return localStorage.getItem("userRole") || "User"; // ✅ Direkt aus dem localStorage initialisieren
  });

  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem("username") || null;
  });

  const [password, setPassword] = useState<string | null>(() => {
    return localStorage.getItem("password") || null;
  });

  useEffect(() => {
    localStorage.setItem("userRole", role);
  }, [role]);

  useEffect(() => {
    if (username && password) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    }
  }, [username, password]);

  const setCredentials = (newUsername: string | null, newPassword: string | null) => {
    setUsername(newUsername);
    setPassword(newPassword);
    if (newUsername && newPassword) {
      localStorage.setItem("username", newUsername);
      localStorage.setItem("password", newPassword);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
  };

  return (
    <UserContext.Provider value={{ role, setRole, username, password, setCredentials }}>
      {children}
    </UserContext.Provider>
  );
}

// 🎯 Hook zum Abrufen der aktuellen Benutzerinformationen
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser muss innerhalb von UserProvider verwendet werden!");
  }
  return context;
}

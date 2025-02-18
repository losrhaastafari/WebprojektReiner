"use client";

import { createContext, useContext, useState } from "react";

// 🎯 Interface für den User-Context
interface UserContextType {
  role: string;
  setRole: (role: string) => void;
}

// 📌 Context erstellen
const UserContext = createContext<UserContextType | undefined>(undefined);

// 🎯 Provider-Komponente
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string>("User"); // Standardrolle

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

// 🎯 Hook zum Abrufen der aktuellen Rolle
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser muss innerhalb von UserProvider verwendet werden!");
  }
  return context;
}

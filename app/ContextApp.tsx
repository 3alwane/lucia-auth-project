"use client";

// AppContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the type for the user object
type User = {
  id: string;
  username: string;
};

// Define the type for your context state
interface AppContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Create a default context value
const defaultContextValue: AppContextType = {
  user: null,
  setUser: () => {},
};

// Create the context
const AppContext = createContext<AppContextType>(defaultContextValue);

// Custom hook for consuming the context
export const useAppContext = () => {
  return useContext(AppContext);
};

// Define the provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Type the state properly

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export function useContextApp() {
  return useContext(AppContext);
}

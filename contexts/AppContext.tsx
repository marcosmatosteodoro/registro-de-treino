"use client";

import { User } from '@/models/user';
import { Treino } from '@/models/treino';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentUser: User | null;
  currentTreino: Treino | null;
  setCurrentUser: (user: User) => void;
  setCurrentTreino: (treino: Treino) => void;
  clearUser: () => void;
  clearTreino: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTreino, setCurrentTreino] = useState<Treino | null>(null);

  const clearUser = () => {
    setCurrentUser(null);
    setCurrentTreino(null);
  };

  const clearTreino = () => {
    setCurrentTreino(null);
  };

  const value: AppContextType = {
    currentUser,
    currentTreino,
    setCurrentUser,
    setCurrentTreino,
    clearUser,
    clearTreino,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
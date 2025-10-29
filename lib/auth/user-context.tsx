"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface UserContextType {
  userId: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  user: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUserId(user.id);
    } else {
      setUserId(null);
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <UserContext.Provider value={{ userId, isLoaded, isSignedIn: isSignedIn || false, user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
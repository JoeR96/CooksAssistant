"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook for managing user authentication state
 */
export function useAuthState() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    isLoaded,
    isSignedIn,
    userId: user?.id || null,
    signOut: handleSignOut,
  };
}

/**
 * Hook that redirects to sign-in if not authenticated
 */
export function useRequireAuth() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  return { isLoaded, isSignedIn };
}

/**
 * Hook for user session information
 */
export function useUserSession() {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    userId: user?.id || null,
    email: user?.emailAddresses[0]?.emailAddress || null,
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
    imageUrl: user?.imageUrl || null,
    isLoaded,
    isSignedIn,
  };
}
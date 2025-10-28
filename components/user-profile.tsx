"use client";

import { UserButton } from "@clerk/nextjs";
import { useUserSession } from "@/lib/auth/hooks";

export function UserProfile() {
  const { isLoaded, isSignedIn } = useUserSession();

  if (!isLoaded) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
          userButtonPopoverCard: "shadow-lg border-0",
        }
      }}
      afterSignOutUrl="/sign-in"
    />
  );
}
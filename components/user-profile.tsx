"use client";

import { UserButton } from "@clerk/nextjs";
import { useUserSession } from "@/lib/auth/hooks";
import { Button, Skeleton } from "@mui/material";
import { Login } from "@mui/icons-material";
import Link from "next/link";

export function UserProfile() {
  const { isLoaded, isSignedIn } = useUserSession();

  if (!isLoaded) {
    return (
      <Skeleton variant="circular" width={40} height={40} />
    );
  }

  if (!isSignedIn) {
    return (
      <Link href="/sign-in" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<Login />}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
          userButtonPopoverCard: "shadow-lg border-0",
        }
      }}
      afterSignOutUrl="/"
    />
  );
}
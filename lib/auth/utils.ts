import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Get the current user ID, redirecting to sign-in if not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return userId;
}

/**
 * Get the current user information
 */
export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

/**
 * Check if user is authenticated without redirecting
 */
export async function isAuthenticated() {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Get user ID with session validation
 */
export async function getUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

/**
 * Require authentication and return user info
 */
export async function requireUserAuth() {
  const userId = await requireAuth();
  const user = await getCurrentUser();
  
  return { userId, user };
}
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Get user session information
 */
export async function getUserSession() {
  try {
    const { userId, sessionId } = await auth();
    
    if (!userId || !sessionId) {
      return null;
    }

    const user = await clerkClient.users.getUser(userId);
    
    return {
      userId,
      sessionId,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
      }
    };
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
}

/**
 * Validate user session and return user ID
 */
export async function validateSession(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error("Error validating session:", error);
    return null;
  }
}

/**
 * Check if user owns a resource
 */
export async function checkResourceOwnership(resourceUserId: string): Promise<boolean> {
  try {
    const { userId } = await auth();
    return userId === resourceUserId;
  } catch (error) {
    console.error("Error checking resource ownership:", error);
    return false;
  }
}
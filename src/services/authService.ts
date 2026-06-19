import { signIn, signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export const authService = {
  /**
   * Log in a user with their email and password using AWS Amplify Cognito.
   * Uses latest Amplify v6 syntax.
   */
  async login(email: string, password: string) {
    const response = await signIn({
      username: email,
      password: password,
    });
    return response;
  },

  /**
   * Log out the currently authenticated Cognito session.
   * Uses latest Amplify v6 syntax.
   */
  async logout() {
    await signOut();
  },

  /**
   * Retrieves the currently logged in user info.
   * Uses latest Amplify v6 syntax.
   */
  async getCurrentUser() {
    return await getCurrentUser();
  },

  /**
   * Retrieves the current auth session including tokens.
   * Uses latest Amplify v6 syntax.
   */
  async getCurrentSession() {
    return await fetchAuthSession();
  },

  /**
   * Helper to check if a user session is active.
   */
  async isAuthenticated() {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};

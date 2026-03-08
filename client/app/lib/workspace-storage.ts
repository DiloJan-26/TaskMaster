/**
 * Workspace persistence utilities
 * Handles saving and retrieving the last accessed workspace
 */

const LAST_WORKSPACE_KEY = "lastAccessedWorkspaceId";

/**
 * Get the last accessed workspace ID from localStorage
 */
export const getLastAccessedWorkspaceId = (): string | null => {
  try {
    return localStorage.getItem(LAST_WORKSPACE_KEY);
  } catch (error) {
    console.error(
      "Error reading lastAccessedWorkspaceId from localStorage:",
      error,
    );
    return null;
  }
};

/**
 * Save the workspace ID as the last accessed workspace
 */
export const setLastAccessedWorkspaceId = (workspaceId: string): void => {
  try {
    localStorage.setItem(LAST_WORKSPACE_KEY, workspaceId);
  } catch (error) {
    console.error(
      "Error saving lastAccessedWorkspaceId to localStorage:",
      error,
    );
  }
};

/**
 * Clear the last accessed workspace
 */
export const clearLastAccessedWorkspaceId = (): void => {
  try {
    localStorage.removeItem(LAST_WORKSPACE_KEY);
  } catch (error) {
    console.error(
      "Error clearing lastAccessedWorkspaceId from localStorage:",
      error,
    );
  }
};

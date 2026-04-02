import { adminMenu } from "../adminMenu";

/**
 * Robustly checks if a user has a specific permission.
 * Handles both string arrays and object arrays (checking name/key properties).
 */
export const hasPermission = (userPermissions: any[], requiredPermission: string): boolean => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (!requiredPermission) return true;

  return userPermissions.some(p => {
    if (typeof p === 'string') return p === requiredPermission;
    if (typeof p === 'object' && p !== null) {
      // Check common property names for permission objects
      return (
        p.name === requiredPermission || 
        p.key === requiredPermission || 
        p.permission === requiredPermission ||
        p.code === requiredPermission
      );
    }
    return false;
  });
};

/**
 * Returns the first authorized path for an admin user based on their permissions.
 */
export const getLandingPath = (user: any): string => {
  if (!user || user.role !== "admin") return "/";
  
  const userPermissions = user.permissions || [];
  if (userPermissions.length === 0) return "/";

  for (const item of adminMenu) {
    if (hasPermission(userPermissions, item.permission)) {
      if (item.to) return item.to;
      if (item.children && item.children.length > 0) return item.children[0].to;
    }
  }

  return "/";
};

/**
 * Strictly checks if a specific admin path is authorized for a user.
 * Uses a whitelist approach based on adminMenu mapping.
 */
export const isPathAllowed = (path: string, user: any): boolean => {
  if (!user || user.role !== "admin") return false;
  
  const userPermissions = user.permissions || [];
  if (userPermissions.length === 0) return false;

  // Normalize path by removing trailing slash for comparison
  const cleanPath = path.replace(/\/$/, "");
  const adminRoot = "/admin";

  // Root admin path is allowed as it handles internal redirection
  if (cleanPath === adminRoot) return true;

  // Search for the path in adminMenu
  for (const item of adminMenu) {
    // 1. Check top-level menu item
    if (item.to) {
      const cleanItemTo = item.to.replace(/\/$/, "");
      if (cleanPath === cleanItemTo || cleanPath.startsWith(cleanItemTo + "/")) {
        return hasPermission(userPermissions, item.permission);
      }
    }
    
    // 2. Check nested children
    if (item.children) {
      const matchingChild = item.children.find(child => {
        const cleanChildTo = child.to.replace(/\/$/, "");
        return cleanPath === cleanChildTo || cleanPath.startsWith(cleanChildTo + "/");
      });
      
      if (matchingChild) {
        // Most routes in this app use the parent's permission for all children
        return hasPermission(userPermissions, item.permission);
      }
    }
  }

  // Paths starting with /admin that are NOT found in the menu 
  // (e.g., system utilities, profile) are allowed only if the user 
  // is an admin who has at least some permissions.
  return cleanPath.startsWith(adminRoot);
};


import { useCallback } from "react";

// Create an interface for location to avoid direct dependency on react-router
export interface Location {
  pathname: string;
}

// Fallback location when router context is not available
export const DEFAULT_LOCATION: Location = {
  pathname: "/home"
};

// Navigation utilities that work both inside and outside router context
export const navigateToPath = (path: string): void => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

export const goBack = (): void => {
  if (typeof window !== 'undefined' && window.history) {
    window.history.back();
  }
};

// Utility to check if a path is active
export const isPathActive = (currentPath: string, path: string): boolean => {
  return currentPath === path;
};

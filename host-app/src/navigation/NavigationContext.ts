import { createContext } from "react";

export interface NavigationEvent {
  path: string;
  replace?: boolean;
  state?: unknown;
}

export interface NavigationMethods {
  navigate: (
    path: string,
    options?: { replace?: boolean; state?: unknown }
  ) => void;
  goBack: () => void;
  currentPath: string;
}

export const NavigationContext = createContext<NavigationMethods | null>(null);

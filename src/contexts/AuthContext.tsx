import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "agency_user";

/**
 * Load user from localStorage
 */
function loadUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load user from localStorage:", error);
  }
  return null;
}

/**
 * Save user to localStorage
 */
function saveUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save user to localStorage:", error);
  }
}

/**
 * Default user for development/demo purposes
 * In production, this would come from authentication
 * Note: This is only used if no user is found in localStorage
 */
const DEFAULT_USER: User | null = null; // Don't auto-login, require authentication

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(() => {
    // Try to load from localStorage first
    const storedUser = loadUser();
    if (storedUser) {
      return storedUser;
    }
    // No default user - require login
    return DEFAULT_USER;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    saveUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


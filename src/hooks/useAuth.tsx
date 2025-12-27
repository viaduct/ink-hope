import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { mockUser, type MockUser } from "@/data/mockData";

const AUTH_STORAGE_KEY = "ink-hope-auth";

interface User {
  id: string;
  email: string;
  user_metadata?: {
    display_name?: string;
  };
}

interface Session {
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

interface StoredAuth {
  user: User;
  email: string;
  displayName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function createUserFromStored(stored: StoredAuth): User {
  return {
    id: stored.user.id,
    email: stored.email,
    user_metadata: {
      display_name: stored.displayName,
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredAuth = JSON.parse(stored);
        const restoredUser = createUserFromStored(parsed);
        setUser(restoredUser);
        setSession({ user: restoredUser });
      } catch (e) {
        console.error("Failed to restore auth state:", e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      // Simulate sign up - in demo mode, always succeed
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        user_metadata: {
          display_name: displayName || email.split("@")[0],
        },
      };

      const authData: StoredAuth = {
        user: newUser,
        email,
        displayName: displayName || email.split("@")[0],
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      setUser(newUser);
      setSession({ user: newUser });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate sign in - use mock user for demo
      const loggedInUser: User = {
        id: mockUser.id,
        email: email || mockUser.email,
        user_metadata: {
          display_name: mockUser.display_name,
        },
      };

      const authData: StoredAuth = {
        user: loggedInUser,
        email: loggedInUser.email,
        displayName: mockUser.display_name,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      setUser(loggedInUser);
      setSession({ user: loggedInUser });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Extend the User type to include the metadata we need
type ExtendedUser = User & {
  name?: string;
}

type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up authentication state listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        // Add name from metadata to the user object
        if (session?.user) {
          const userData = session.user as ExtendedUser;
          userData.name = session.user.user_metadata?.name || '';
          setUser(userData);
        } else {
          setUser(null);
        }
        
        // When the session changes, sync the loading state
        if (event === "SIGNED_IN") {
          setIsLoading(false);
        } else if (event === "SIGNED_OUT") {
          setIsLoading(false);
        }
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // Add name from metadata to the user object
      if (session?.user) {
        const userData = session.user as ExtendedUser;
        userData.name = session.user.user_metadata?.name || '';
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name // Store the name in user metadata
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account created successfully");
      return;
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged in successfully");
      return;
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

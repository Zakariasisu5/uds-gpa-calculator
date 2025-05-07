
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const LOCAL_STORAGE_AUTH_KEY = "uds_gpa_auth";
const LOCAL_STORAGE_USERS_KEY = "uds_gpa_users";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const signup = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // Get existing users from local storage or initialize empty array
      const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if user already exists
      const existingUser = users.find((u: User & { password: string }) => u.email === email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name,
        password // In a real app, we would hash this password
      };
      
      // Add user to users list
      users.push(newUser);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
      
      // Log user in
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Get users from local storage
      const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (!usersJson) {
        throw new Error("No users found");
      }
      
      const users = JSON.parse(usersJson);
      const foundUser = users.find(
        (u: User & { password: string }) => 
          u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Store auth user without password
      const { password: _, ...userWithoutPassword } = foundUser;
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to log in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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

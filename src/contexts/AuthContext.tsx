import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  points: number;
  level: number;
  avatar: string;
  completedChallenges: string[];
  joinDate: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateUser: (user: User) => void;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const INITIAL_USERS: User[] = [
  {
    id: "admin-1",
    name: "Admin Master",
    email: "admin@codequest.com",
    role: "admin",
    points: 0,
    level: 99,
    avatar: "A",
    completedChallenges: [],
    joinDate: "2024-01-01",
  },
  {
    id: "admin-2",
    name: "Jane Admin",
    email: "jane@codequest.com",
    role: "admin",
    points: 0,
    level: 99,
    avatar: "J",
    completedChallenges: [],
    joinDate: "2024-01-05",
  },
  {
    id: "user-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "user",
    points: 2850,
    level: 8,
    avatar: "A",
    completedChallenges: ["c1", "c2", "c3", "c4", "c5"],
    joinDate: "2024-02-10",
  },
  {
    id: "user-2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    points: 2100,
    level: 6,
    avatar: "B",
    completedChallenges: ["c1", "c2", "c3"],
    joinDate: "2024-02-15",
  },
  {
    id: "user-3",
    name: "Charlie Lee",
    email: "charlie@example.com",
    role: "user",
    points: 3400,
    level: 10,
    avatar: "C",
    completedChallenges: ["c1", "c2", "c3", "c4", "c5", "c6"],
    joinDate: "2024-01-20",
  },
  {
    id: "user-4",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "user",
    points: 1500,
    level: 4,
    avatar: "D",
    completedChallenges: ["c1", "c2"],
    joinDate: "2024-03-01",
  },
];

// Simple password store
const PASSWORDS: Record<string, string> = {
  "admin@codequest.com": "admin123",
  "jane@codequest.com": "admin123",
  "alice@example.com": "user123",
  "bob@example.com": "user123",
  "charlie@example.com": "user123",
  "diana@example.com": "user123",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [passwords, setPasswords] = useState<Record<string, string>>(PASSWORDS);

  const login = (email: string, password: string) => {
    const user = allUsers.find((u) => u.email === email);
    if (!user) return { success: false, message: "No account found with that email." };
    if (passwords[email] !== password) return { success: false, message: "Incorrect password." };
    setCurrentUser(user);
    return { success: true, message: "Login successful!" };
  };

  const signup = (name: string, email: string, password: string) => {
    if (allUsers.find((u) => u.email === email)) {
      return { success: false, message: "Email already registered." };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user",
      points: 0,
      level: 1,
      avatar: name.charAt(0).toUpperCase(),
      completedChallenges: [],
      joinDate: new Date().toISOString().split("T")[0],
    };
    setAllUsers((prev) => [...prev, newUser]);
    setPasswords((prev) => ({ ...prev, [email]: password }));
    setCurrentUser(newUser);
    return { success: true, message: "Account created!" };
  };

  const logout = () => setCurrentUser(null);

  const updateUser = (user: User) => {
    setCurrentUser(user);
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, updateUser, allUsers, setAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

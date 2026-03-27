import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { isAdminSessionValid, createAdminSession, clearAdminSession } from "@/lib/productStorage";

interface AdminContextValue {
  isLoggedIn: boolean;
  showLogin: boolean;
  showDashboard: boolean;
  triggerLogin: () => void;
  handleLogin: (password: string) => boolean;
  handleLogout: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  closeLogin: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAdminSessionValid());
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const triggerLogin = useCallback(() => {
    if (isAdminSessionValid()) {
      setIsLoggedIn(true);
      setShowDashboard(true);
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLogin = useCallback((password: string): boolean => {
    if (password === "joshbond") {
      createAdminSession();
      setIsLoggedIn(true);
      setShowLogin(false);
      setShowDashboard(true);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    clearAdminSession();
    setIsLoggedIn(false);
    setShowDashboard(false);
    setShowLogin(false);
  }, []);

  const openDashboard = useCallback(() => setShowDashboard(true), []);
  const closeDashboard = useCallback(() => setShowDashboard(false), []);
  const closeLogin = useCallback(() => setShowLogin(false), []);

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        showLogin,
        showDashboard,
        triggerLogin,
        handleLogin,
        handleLogout,
        openDashboard,
        closeDashboard,
        closeLogin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

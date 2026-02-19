"use client";

import { deleteCookie, setCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getProfile, logoutAPI } from "@/api/auth";
import { STORAGE_KEYS } from "@/utils/constant";
import AuthLoading from "@/components/Common/AuthLoading";

type UserProfile = {
  id: string;
  name: string;
  email?: string;
  role: "ADMIN" | "SALES";
};

type AuthContextType = {
  afterSuccessLogin: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearLogout: () => void;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSales: boolean;
  refreshProfile: () => Promise<void>;
  token: string | null;
};

const defaultAuth: AuthContextType = {
  afterSuccessLogin: async () => {},
  logout: async () => {},
  clearLogout: () => {},
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  isSales: false,
  refreshProfile: async () => {},
  token: null,
};

export const AuthContext = createContext<AuthContextType>(defaultAuth);
export const useAuthContext = () => useContext(AuthContext);


export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const clearLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
    
    deleteCookie(STORAGE_KEYS.TOKEN);
    setUserProfile(null);
    setIsAuthenticated(false);
    setToken(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUserProfile(profile.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile.data));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const afterSuccessLogin = useCallback(async (token: string, refreshToken: string) => {
    try {
      const expiredSeconds = 60 * 60 * 24;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      
      setCookie(STORAGE_KEYS.TOKEN, token, { 
        maxAge: expiredSeconds,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      setToken(token);
      
      const profile = await getProfile();
      setUserProfile(profile.data);
      setIsAuthenticated(true);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile.data));
      }

      const redirectPath = "/";
      router.replace(redirectPath);
      
    } catch (error) {
      clearLogout();
      throw error;
    }
  }, [router, clearLogout]);


  const logout = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem(STORAGE_KEYS.TOKEN)
        : null;
      
      if (token) {
        await logoutAPI();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearLogout();
      router.push('/login');
    }
  }, [router, clearLogout]);

  const {  isAdmin, isSales } = useMemo(() => ({
    isAdmin: userProfile?.role === 'ADMIN',
    isSales: userProfile?.role === 'SALES',
  }), [userProfile?.role]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);

        if (!storedToken) {
          clearLogout();
          setIsLoading(false);
          return;
        }

        if (storedProfile) {
          const profileData = JSON.parse(storedProfile);
          setUserProfile(profileData);
          setIsAuthenticated(true);
          setToken(storedToken);
          setIsLoading(false);
          return;
        }

        const profile = await getProfile();
        setUserProfile(profile.data);
        setIsAuthenticated(true);
        setToken(storedToken);
        
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile.data));

      } catch (error) {
        console.error('Auth check failed:', error);
        clearLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [clearLogout]);

  useEffect(() => {
    if (isLoading || typeof window === 'undefined') return;

    const publicPaths = ['/login', '/verify'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    } else if (isAuthenticated && isPublicPath) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router, userProfile?.role]);


  const contextValue = useMemo(() => ({
    afterSuccessLogin,
    logout,
    clearLogout,
    userProfile,
    isAuthenticated,
    isLoading,
    isAdmin,
    isSales,
    refreshProfile,
    token,
  }), [
    afterSuccessLogin,
    logout,
    clearLogout,
    userProfile,
    isAuthenticated,
    isLoading,
    isAdmin,
    isSales,
    refreshProfile,
    token,
  ]);

 if (!hasMounted || isLoading) {
    return <AuthLoading />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
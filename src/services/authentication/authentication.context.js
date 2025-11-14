/**
 * Authentication Context
 * 
 * React Context for managing authentication state across the app.
 * Provides authentication methods and user state to all components.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../../infrastructure/supabase';
import { checkAuthStatus, login as loginService, logout as logoutService, register as registerService, resendOTP as resendOTPService, verifyOTP as verifyOTPService } from './authentication.service';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(null);

  // Check authentication status on mount and listen for auth changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated: authenticated, user: currentUser } = await checkAuthStatus();
        setIsAuthenticated(authenticated);
        setUser(currentUser || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          // Fetch user profile data
          try {
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!profileError && profile) {
              setUser({
                ...session.user,
                username: profile.username || session.user.email?.split('@')[0],
                tokenBalance: profile.token_balance || 0,
                role: profile.role || 'user',
              });
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email,
                username: session.user.email?.split('@')[0] || 'User',
                tokenBalance: 0,
                role: 'user',
              });
            }
          } catch (err) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              username: session.user.email?.split('@')[0] || 'User',
              tokenBalance: 0,
              role: 'user',
            });
          }
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const result = await loginService(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await logoutService();
      
      if (result.success) {
        setUser(null);
        setIsAuthenticated(false);
        setPendingVerificationEmail(null); // Clear pending verification on logout
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local state
      setUser(null);
      setIsAuthenticated(false);
      setPendingVerificationEmail(null);
      return {
        success: false,
        error: error.message || 'Failed to logout',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (email, password, username, phoneNumber = null) => {
    setIsLoading(true);
    try {
      const result = await registerService(email, password, username, phoneNumber);
      
      console.log('Auth context - register result:', result);
      
      if (result.success) {
        // If verification is required, don't set user as authenticated yet
        if (result.requiresVerification) {
          // Store the email that needs verification
          const emailToVerify = result.user?.email || email;
          console.log('Auth context - Setting pendingVerificationEmail to:', emailToVerify);
          setPendingVerificationEmail(emailToVerify);
          setIsLoading(false); // Set loading to false so RootNavigator can render
          return { success: true, requiresVerification: true, user: result.user };
        }
        setUser(result.user);
        setIsAuthenticated(true);
        setPendingVerificationEmail(null);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }, []);

  // Verify OTP function
  const verifyOTP = useCallback(async (email, token) => {
    setIsLoading(true);
    try {
      const result = await verifyOTPService(email, token);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setPendingVerificationEmail(null); // Clear pending verification
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Resend OTP function
  const resendOTP = useCallback(async (email) => {
    try {
      const result = await resendOTPService(email);
      return result;
    } catch (error) {
      console.error('Resend OTP error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }, []);

  // Helper function to check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    pendingVerificationEmail,
    isAdmin,
    login,
    logout,
    register,
    verifyOTP,
    resendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


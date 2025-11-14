/**
 * Authentication Service
 * 
 * Handles user authentication operations including login, logout, and session management.
 * Integrated with Supabase for authentication and user management.
 */

import { supabase } from '../../infrastructure/supabase';
import { handleError, ERROR_TYPES, createErrorResponse } from '../../utils/error-handler';
import { logger } from '../../utils/logger';
import { validateEmail, validatePassword } from '../../utils/validation';
import { TABLES } from '../../constants/tables';

/**
 * Login with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const login = async (email, password) => {
  try {
    // Validate input using validation utilities
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return createErrorResponse(emailValidation.error, ERROR_TYPES.VALIDATION);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return createErrorResponse(passwordValidation.error, ERROR_TYPES.VALIDATION);
    }

    // Supabase authentication
    logger.debug('Attempting login', { email: email.trim() });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      const errorResult = handleError(error, 'login', false);
      return createErrorResponse(errorResult.message, errorResult.type, error);
    }

    // Get user profile data if available
    let userProfile = null;
    if (data.user) {
      // Try to fetch additional user profile data from user_profiles table
      try {
        const { data: profile, error: profileError } = await supabase
          .from(TABLES.USER_PROFILES)
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileError && profile) {
          userProfile = {
            ...data.user,
            username: profile.username || data.user.email?.split('@')[0],
            tokenBalance: profile.token_balance || 0,
            role: profile.role || 'user',
          };
        }
      } catch (err) {
        // If users table doesn't exist or query fails, use basic user data
        logger.warn('Could not fetch user profile', err);
      }
    }

    return {
      success: true,
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        username: data.user.email?.split('@')[0] || 'User',
        tokenBalance: 0,
        role: 'user',
      },
      session: data.session,
    };
  } catch (error) {
    const errorResult = handleError(error, 'login', false);
    return createErrorResponse(errorResult.message, errorResult.type, error);
  }
};

/**
 * Logout the current user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logout = async () => {
  try {
    // Supabase logout
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to logout',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message || 'Failed to logout',
    };
  }
};

/**
 * Check if user is currently authenticated
 * @returns {Promise<{isAuthenticated: boolean, user?: object}>}
 */
export const checkAuthStatus = async () => {
  try {
    // Check Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      logger.warn('Error getting session', error);
      return {
        isAuthenticated: false,
      };
    }

    if (session?.user) {
      // Try to fetch additional user profile data
      let userProfile = null;
      try {
        const { data: profile, error: profileError } = await supabase
          .from(TABLES.USER_PROFILES)
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profileError && profile) {
          userProfile = {
            ...session.user,
            username: profile.username || session.user.email?.split('@')[0],
            tokenBalance: profile.token_balance || 0,
            role: profile.role || 'user',
          };
        }
      } catch (err) {
        // If users table doesn't exist or query fails, use basic user data
        logger.warn('Could not fetch user profile', err);
      }

      return {
        isAuthenticated: true,
        user: userProfile || {
          id: session.user.id,
          email: session.user.email,
          username: session.user.email?.split('@')[0] || 'User',
          tokenBalance: 0,
          role: 'user',
        },
      };
    }

    return {
      isAuthenticated: false,
    };
  } catch (error) {
    logger.error('Check auth status error', error);
    return {
      isAuthenticated: false,
    };
  }
};

/**
 * Register a new user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} username - User's username
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const register = async (email, password, username, phoneNumber = null) => {
  try {
    // Validate input
    if (!email || !email.trim()) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    // Supabase registration
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          username: username || email.split('@')[0],
          phone_number: phoneNumber,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Registration failed. Please try again.',
      };
    }

    // Check if email verification is required
    // If session is null, user needs to verify email
    // With email confirmation enabled in Supabase, session will be null until verified
    const requiresVerification = !data.session && data.user;

    // Don't create profile here - wait for email verification
    // Profile will be created in verifyOTP function after successful verification
    
    logger.debug('Registration result', {
      hasUser: !!data.user,
      hasSession: !!data.session,
      requiresVerification,
      userEmail: data.user?.email,
    });
    
    return {
      success: true,
      requiresVerification: requiresVerification,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        username: username || email.split('@')[0],
        tokenBalance: 0,
      } : null,
    };
  } catch (error) {
    const errorResult = handleError(error, 'register', false);
    return createErrorResponse(errorResult.message, errorResult.type, error);
  }
};

/**
 * Verify OTP code for email verification
 * @param {string} email - User's email address
 * @param {string} token - OTP verification code
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const verifyOTP = async (email, token) => {
  try {
    if (!email || !email.trim()) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    if (!token || token.length !== 6) {
      return {
        success: false,
        error: 'Please enter a valid 6-digit code',
      };
    }

    // Verify OTP with Supabase
    logger.debug('Verifying OTP', { email: email.trim() });
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token,
      type: 'email',
    });

    if (error) {
      const errorResult = handleError(error, 'verifyOTP', false);
      return createErrorResponse(
        errorResult.message || 'Invalid verification code. Please try again.',
        errorResult.type,
        error
      );
    }

    logger.info('OTP verified successfully', { userId: data.user?.id });

    // After successful verification, create user profile
    if (data.user) {
      logger.debug('Creating user profile for verified user', { userId: data.user.id });
      try {
        // Get user metadata
        const username = data.user.user_metadata?.username || data.user.email?.split('@')[0];
        const phoneNumber = data.user.user_metadata?.phone_number || null;

        logger.debug('Profile data', { username, phoneNumber, email: data.user.email });

        // Build profile data
        const profileData = {
          id: data.user.id,
          username: username,
        };

        const fullProfileData = {
          ...profileData,
          email: data.user.email,
          phone_number: phoneNumber,
          token_balance: 0,
          role: 'user', // Default role is 'user', admins are set manually in Supabase
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        logger.debug('Inserting profile', { userId: fullProfileData.id });
        let { error: profileError } = await supabase
          .from(TABLES.USER_PROFILES)
          .insert([fullProfileData]);

        // If error about missing columns, try with minimal fields
        if (profileError && (profileError.code === 'PGRST204' || profileError.message.includes('column'))) {
          logger.warn('Retrying with minimal profile data', { error: profileError.message });
          ({ error: profileError } = await supabase
            .from(TABLES.USER_PROFILES)
            .insert([profileData]));
        }

        if (profileError) {
          logger.warn('Could not create user profile after verification', profileError);
          // If RLS error, try again - user should be authenticated now
          if (profileError.code === '42501') {
            logger.debug('RLS error, retrying profile creation');
            // Wait a bit and retry
            await new Promise(resolve => setTimeout(resolve, 500));
            ({ error: profileError } = await supabase
              .from(TABLES.USER_PROFILES)
              .insert([fullProfileData]));
            
            if (profileError) {
              logger.error('Still failed to create profile after retry', profileError);
            } else {
              logger.info('Profile created successfully after retry');
            }
          }
          // Continue anyway - user is verified, profile can be created later
        } else {
          logger.info('User profile created successfully after OTP verification');
        }
      } catch (err) {
        logger.error('Error creating user profile after verification', err);
        // Continue anyway - user is verified
      }
    }

    // Get user profile data if available
    let userProfile = null;
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from(TABLES.USER_PROFILES)
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileError && profile) {
          userProfile = {
            ...data.user,
            username: profile.username || data.user.email?.split('@')[0],
            tokenBalance: profile.token_balance || 0,
            role: profile.role || 'user',
          };
        }
      } catch (err) {
        logger.warn('Could not fetch user profile', err);
      }
    }

    return {
      success: true,
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
        tokenBalance: 0,
        role: 'user',
      },
      session: data.session,
    };
  } catch (error) {
    const errorResult = handleError(error, 'verifyOTP', false);
    return createErrorResponse(errorResult.message, errorResult.type, error);
  }
};

/**
 * Resend OTP verification code
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resendOTP = async (email) => {
  try {
    if (!email || !email.trim()) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    // Resend OTP with Supabase
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
    });

    if (error) {
      const errorResult = handleError(error, 'resendOTP', false);
      return createErrorResponse(
        errorResult.message || 'Failed to resend verification code. Please try again.',
        errorResult.type,
        error
      );
    }

    logger.info('OTP resend successful', { email: email.trim() });
    return {
      success: true,
    };
  } catch (error) {
    const errorResult = handleError(error, 'resendOTP', false);
    return createErrorResponse(errorResult.message, errorResult.type, error);
  }
};


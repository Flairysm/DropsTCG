/**
 * Authentication Service
 * 
 * Handles user authentication operations including login, logout, and session management.
 * Integrated with Supabase for authentication and user management.
 */

import { supabase } from '../../infrastructure/supabase';

/**
 * Login with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const login = async (email, password) => {
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

    // Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        const errorMsg = error.message.toLowerCase();
        
        // Check for specific error types
        if (errorMsg.includes('email not confirmed') || 
            errorMsg.includes('email not verified') ||
            errorMsg.includes('email_not_confirmed')) {
          errorMessage = 'Please verify your email address before signing in. Check your inbox for the verification link.';
        } else if (errorMsg.includes('invalid login credentials') || 
                   errorMsg.includes('invalid credentials') ||
                   error.code === 'invalid_credentials' ||
                   error.code === 'invalid_grant') {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (errorMsg.includes('too many requests') || 
                   error.code === 'too_many_requests' ||
                   error.code === 'rate_limit_exceeded') {
          errorMessage = 'Too many login attempts. Please wait a few minutes and try again.';
        } else if (errorMsg.includes('user not found') ||
                   errorMsg.includes('user_not_found')) {
          errorMessage = 'No account found with this email address. Please check your email or sign up.';
        } else if (errorMsg.includes('network') || 
                   errorMsg.includes('connection') ||
                   errorMsg.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          // Use the error message if it's user-friendly, otherwise use generic message
          errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Get user profile data if available
    let userProfile = null;
    if (data.user) {
      // Try to fetch additional user profile data from user_profiles table
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
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
        console.log('Could not fetch user profile:', err);
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
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred. Please try again.',
    };
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
      console.error('Error getting session:', error);
      return {
        isAuthenticated: false,
      };
    }

    if (session?.user) {
      // Try to fetch additional user profile data
      let userProfile = null;
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
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
        console.log('Could not fetch user profile:', err);
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
    console.error('Check auth status error:', error);
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
    
    console.log('Registration result:', {
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
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred. Please try again.',
    };
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
    console.log('Verifying OTP for email:', email.trim());
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token,
      type: 'email',
    });

    if (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.message || 'Invalid verification code. Please try again.',
      };
    }

    console.log('OTP verified successfully, user ID:', data.user?.id);

    // After successful verification, create user profile
    if (data.user) {
      console.log('Creating user profile for verified user:', data.user.id);
      try {
        // Get user metadata
        const username = data.user.user_metadata?.username || data.user.email?.split('@')[0];
        const phoneNumber = data.user.user_metadata?.phone_number || null;

        console.log('Profile data:', { username, phoneNumber, email: data.user.email });

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

        console.log('Inserting profile with data:', fullProfileData);
        let { error: profileError } = await supabase
          .from('user_profiles')
          .insert([fullProfileData]);

        // If error about missing columns, try with minimal fields
        if (profileError && (profileError.code === 'PGRST204' || profileError.message.includes('column'))) {
          console.log('Retrying with minimal profile data:', profileError.message);
          ({ error: profileError } = await supabase
            .from('user_profiles')
            .insert([profileData]));
        }

        if (profileError) {
          console.error('Could not create user profile after verification:', profileError);
          // If RLS error, try again - user should be authenticated now
          if (profileError.code === '42501') {
            console.log('RLS error, retrying profile creation...');
            // Wait a bit and retry
            await new Promise(resolve => setTimeout(resolve, 500));
            ({ error: profileError } = await supabase
              .from('user_profiles')
              .insert([fullProfileData]));
            
            if (profileError) {
              console.error('Still failed to create profile after retry:', profileError);
            } else {
              console.log('Profile created successfully after retry');
            }
          }
          // Continue anyway - user is verified, profile can be created later
        } else {
          console.log('User profile created successfully after OTP verification');
        }
      } catch (err) {
        console.error('Error creating user profile after verification:', err);
        // Continue anyway - user is verified
      }
    }

    // Get user profile data if available
    let userProfile = null;
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
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
        console.log('Could not fetch user profile:', err);
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
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred. Please try again.',
    };
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
      return {
        success: false,
        error: error.message || 'Failed to resend verification code. Please try again.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Resend OTP error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred. Please try again.',
    };
  }
};


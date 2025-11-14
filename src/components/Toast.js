/**
 * Toast Notification Component
 * 
 * Provides toast notifications for user feedback.
 * Can be used instead of Alert for non-critical messages.
 */

import React, { useState, useCallback, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const ToastContainer = styled(Animated.View)`
  position: absolute;
  top: 100px;
  left: 20px;
  right: 20px;
  z-index: 9999;
  elevation: 10;
`;

const ToastContent = styled.View`
  background-color: ${(props) => {
    switch (props.type) {
      case 'success':
        return '#4ade80';
      case 'error':
        return '#ff3b30';
      case 'warning':
        return '#ff9500';
      case 'info':
      default:
        return '#40ffdc';
    }
  }};
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const ToastIcon = styled.View`
  margin-right: 12px;
`;

const ToastText = styled.Text`
  flex: 1;
  color: #0a0019;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

const ToastContext = React.createContext({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ message, type });

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after duration
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    }
  }, [fadeAnim, slideAnim]);

  // Set global instance on mount
  React.useEffect(() => {
    setToastInstance({ showToast, hideToast });
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setToastInstance(null);
    };
  }, [showToast, hideToast]);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  }, [fadeAnim, slideAnim]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <ToastContainer
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <TouchableOpacity onPress={hideToast} activeOpacity={0.9}>
            <ToastContent type={toast.type}>
              <ToastIcon>
                <Ionicons name={getIcon(toast.type)} size={24} color="#0a0019" />
              </ToastIcon>
              <ToastText>{toast.message}</ToastText>
            </ToastContent>
          </TouchableOpacity>
        </ToastContainer>
      )}
    </ToastContext.Provider>
  );
};

// Global toast instance (will be set by provider)
let toastInstance = null;

export const setToastInstance = (instance) => {
  toastInstance = instance;
};

// Convenience functions for global use
export const toast = {
  success: (message, duration = 3000) => {
    if (toastInstance) {
      toastInstance.showToast(message, 'success', duration);
    }
  },
  error: (message, duration = 4000) => {
    if (toastInstance) {
      toastInstance.showToast(message, 'error', duration);
    }
  },
  warning: (message, duration = 3000) => {
    if (toastInstance) {
      toastInstance.showToast(message, 'warning', duration);
    }
  },
  info: (message, duration = 3000) => {
    if (toastInstance) {
      toastInstance.showToast(message, 'info', duration);
    }
  },
};

export default ToastProvider;


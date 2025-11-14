import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ToastProvider from './src/components/Toast';
import { RootNavigator } from './src/infrastructure/navigation';
import { ThemeProvider } from './src/infrastructure/theme';
import { AuthProvider } from './src/services/authentication/authentication.context';
import ErrorBoundary from './src/utils/error-boundary';
import { logger } from './src/utils/logger';

export default function App() {
  const handleErrorReset = React.useCallback(() => {
    // Reset error boundary state by remounting the app
    // This will clear any error state and restart the app
    // In production, you might want to add analytics/logging here
    logger.info('Error boundary reset triggered - attempting to recover from error');
  }, []);

  return (
    <ErrorBoundary onReset={handleErrorReset} showDetails={__DEV__}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

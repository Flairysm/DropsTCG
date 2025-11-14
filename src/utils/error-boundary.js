/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { logger } from './logger';

const Container = styled.View`
  flex: 1;
  background-color: #0a0019;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const ErrorCard = styled.View`
  background-color: #12042b;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  border-width: 1px;
  border-color: rgba(255, 59, 48, 0.3);
`;

const ErrorIcon = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 12px;
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  color: #ffffff;
  opacity: 0.7;
  text-align: center;
  margin-bottom: 8px;
  line-height: 20px;
`;

const ErrorDetails = styled.Text`
  font-size: 12px;
  color: rgba(255, 59, 48, 0.8);
  font-family: monospace;
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(255, 59, 48, 0.1);
  border-radius: 8px;
  max-height: 200px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled(TouchableOpacity)`
  flex: 1;
  background-color: #40ffdc;
  border-radius: 8px;
  padding: 14px;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #0a0019;
`;

const SecondaryButton = styled(TouchableOpacity)`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px;
  align-items: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.2);
`;

const SecondaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to logging service
    logger.error('ErrorBoundary caught an error', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      stack: error.stack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const { onReset, showDetails = false } = this.props;

      return (
        <Container>
          <ErrorCard>
            <ErrorIcon>
              <Ionicons name="alert-circle" size={64} color="#ff3b30" />
            </ErrorIcon>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              We're sorry, but something unexpected happened. Please try again.
            </ErrorMessage>
            {showDetails && error && (
              <ScrollView>
                <ErrorDetails>
                  {error.toString()}
                  {errorInfo && `\n\n${errorInfo.componentStack}`}
                </ErrorDetails>
              </ScrollView>
            )}
            <ButtonContainer>
              <Button onPress={onReset || this.handleReset} activeOpacity={0.8}>
                <ButtonText>Try Again</ButtonText>
              </Button>
              {showDetails && (
                <SecondaryButton onPress={this.handleReset} activeOpacity={0.8}>
                  <SecondaryButtonText>Hide Details</SecondaryButtonText>
                </SecondaryButton>
              )}
            </ButtonContainer>
          </ErrorCard>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


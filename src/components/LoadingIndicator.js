/**
 * Loading Indicator Components
 * 
 * Provides consistent loading indicators across the app.
 */

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { Skeleton } from './SkeletonLoader';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.backgroundColor || 'transparent'};
  padding: ${(props) => props.padding || 20}px;
`;

const LoadingText = styled.Text`
  color: ${(props) => props.color || '#ffffff'};
  font-size: 14px;
  margin-top: 12px;
  opacity: 0.7;
`;

/**
 * Full screen loading indicator
 */
export const FullScreenLoader = ({ message, backgroundColor = '#0a0019', color = '#40ffdc' }) => {
  return (
    <Container backgroundColor={backgroundColor}>
      <ActivityIndicator size="large" color={color} />
      {message && <LoadingText color={color}>{message}</LoadingText>}
    </Container>
  );
};

/**
 * Inline loading indicator
 */
export const InlineLoader = ({ size = 'small', color = '#40ffdc', style }) => {
  return (
    <View style={[{ padding: 8, alignItems: 'center' }, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

/**
 * Button loading indicator
 */
export const ButtonLoader = ({ color = '#0a0019', size = 'small' }) => {
  return (
    <View style={{ marginRight: 8 }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

/**
 * Overlay loading indicator
 */
export const OverlayLoader = ({ visible, message, backgroundColor = 'rgba(0, 0, 0, 0.7)' }) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      <ActivityIndicator size="large" color="#40ffdc" />
      {message && <LoadingText>{message}</LoadingText>}
    </View>
  );
};

/**
 * Skeleton loading wrapper
 */
export const SkeletonLoader = ({ children, loading, skeleton }) => {
  if (loading) {
    return skeleton || <Skeleton height={100} />;
  }
  return children;
};

export default {
  FullScreenLoader,
  InlineLoader,
  ButtonLoader,
  OverlayLoader,
  SkeletonLoader,
};


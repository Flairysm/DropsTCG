/**
 * Skeleton Loader Components
 * 
 * Provides skeleton loading placeholders for better perceived performance.
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

const SkeletonBase = styled(Animated.View)`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${(props) => props.borderRadius || '8px'};
  overflow: hidden;
`;

const Shimmer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
`;

/**
 * Base Skeleton component with shimmer animation
 */
export const Skeleton = ({ width, height, borderRadius, style, ...props }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <SkeletonBase
      style={[
        {
          width: width || '100%',
          height: height || 20,
          borderRadius: borderRadius || 8,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          width: '50%',
        }}
      />
    </SkeletonBase>
  );
};

/**
 * Skeleton for text lines
 */
export const SkeletonText = ({ lines = 1, lineHeight = 16, spacing = 8, width, ...props }) => {
  return (
    <>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          width={index === lines - 1 && width ? width : '100%'}
          style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
          {...props}
        />
      ))}
    </>
  );
};

/**
 * Skeleton for card components
 */
export const SkeletonCard = ({ height = 200, ...props }) => {
  return (
    <Skeleton
      height={height}
      borderRadius={16}
      style={{ marginBottom: 16 }}
      {...props}
    />
  );
};

/**
 * Skeleton for avatar
 */
export const SkeletonAvatar = ({ size = 100, ...props }) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      {...props}
    />
  );
};

/**
 * Skeleton for button
 */
export const SkeletonButton = ({ height = 48, width = '100%', ...props }) => {
  return (
    <Skeleton
      height={height}
      width={width}
      borderRadius={8}
      {...props}
    />
  );
};

/**
 * Skeleton for list item
 */
export const SkeletonListItem = ({ ...props }) => {
  return (
    <Skeleton
      height={60}
      borderRadius={12}
      style={{ marginBottom: 12 }}
      {...props}
    />
  );
};

/**
 * Skeleton for profile header
 */
export const SkeletonProfileHeader = () => {
  return (
    <>
      <SkeletonAvatar size={100} style={{ alignSelf: 'center', marginBottom: 16 }} />
      <SkeletonText lines={2} lineHeight={20} spacing={8} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={16} style={{ alignSelf: 'center' }} />
    </>
  );
};

/**
 * Skeleton for card grid
 */
export const SkeletonCardGrid = ({ columns = 2, count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard
          key={index}
          height={200}
          style={{
            width: `${100 / columns - 4}%`,
            marginRight: index % columns !== columns - 1 ? '4%' : 0,
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;


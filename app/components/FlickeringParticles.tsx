import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet, Animated, Dimensions } from 'react-native';

interface FlickeringParticlesProps {
  particleCount?: number;
  color?: string;
}

const FlickeringParticles: React.FC<FlickeringParticlesProps> = ({
  particleCount = 50,
  color = '#FFFFFF' // White for maximum visibility
}) => {
  const [particles, setParticles] = useState<Array<{
    x: Animated.Value;
    y: Animated.Value;
    opacity: Animated.Value;
    size: number;
  }>>([]);
  // Initialize with window dimensions immediately for faster loading
  const [containerDimensions, setContainerDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setContainerDimensions({ width, height });
    }
  };

  useEffect(() => {
    const { width, height } = containerDimensions;
    if (width === 0 || height === 0) {
      return;
    }

    // Initialize particles with simplified distribution for faster loading
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      // Simplified distribution - faster calculation
      const gridCols = Math.ceil(Math.sqrt(particleCount));
      const gridRows = Math.ceil(particleCount / gridCols);
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      
      // Faster calculation without complex clamping
      const baseX = (col / Math.max(1, gridCols - 1)) * width;
      const baseY = (row / Math.max(1, gridRows - 1)) * height;
      const randomOffsetX = (Math.random() - 0.5) * (width / Math.max(1, gridCols));
      const randomOffsetY = (Math.random() - 0.5) * (height / Math.max(1, gridRows));
      
      return {
        x: new Animated.Value(Math.max(0, Math.min(width, baseX + randomOffsetX))),
        y: new Animated.Value(Math.max(0, Math.min(height, baseY + randomOffsetY))),
        opacity: new Animated.Value(0.2 + Math.random() * 0.2), // More transparent: 0.2-0.4
        size: 1 + Math.random() * 6, // Varying sizes: 1-7px
      };
    });
    
    setParticles(newParticles);

    // Animate particles very slowly - start immediately without delays
    newParticles.forEach((particle) => {
      const moveDuration = 60000 + Math.random() * 90000; // 60-150 seconds (much slower)
      const flickerDuration = 2000 + Math.random() * 3000; // 2-5 seconds

      // Very slow movement animation - spread particles across entire screen
      const animateMovement = () => {
        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: targetX,
            duration: moveDuration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: targetY,
            duration: moveDuration,
            useNativeDriver: true,
          }),
        ]).start(() => animateMovement());
      };

      // Flicker animation - more subtle
      const animateFlicker = () => {
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 0.15,
            duration: flickerDuration * 0.5,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0.35,
            duration: flickerDuration * 0.5,
            useNativeDriver: true,
          }),
        ]).start(() => animateFlicker());
      };

      // Start animations immediately - no delay
      animateMovement();
      animateFlicker();
    });
  }, [particleCount, containerDimensions]);

  if (Platform.OS === 'web') {
    // Web version using CSS
    useEffect(() => {
      if (typeof document !== 'undefined') {
        const styleId = 'flickering-particles-styles';
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            @keyframes slowMove {
              0% {
                transform: translate(0, 0);
              }
              25% {
                transform: translate(10px, -15px);
              }
              50% {
                transform: translate(-8px, 12px);
              }
              75% {
                transform: translate(12px, 8px);
              }
              100% {
                transform: translate(0, 0);
              }
            }
            @keyframes flicker {
              0%, 100% {
                opacity: 0.15;
              }
              50% {
                opacity: 0.4;
              }
            }
          `;
          document.head.appendChild(style);
        }
      }
    }, []);

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: particleCount }).map((_, i) => {
          const size = 0.5 + Math.random() * 4.5; // Varying sizes: 0.5-5px
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const moveDuration = 60 + Math.random() * 90; // 60-150 seconds (much slower)
          const flickerDuration = 2 + Math.random() * 3; // 2-5 seconds
          const delay = Math.random() * 2;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: color,
                opacity: 0.25,
                boxShadow: `0 0 ${size * 1.5}px ${color}`,
                animation: `slowMove ${moveDuration}s ease-in-out infinite, flicker ${flickerDuration}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>
    );
  }

  // Native mobile version
  return (
    <View style={styles.container} pointerEvents="none" onLayout={handleLayout}>
      {particles.map((particle, index) => {
        const size = particle.size;
        return (
          <Animated.View
            key={`particle-${index}`}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                width: size,
                height: size,
                borderRadius: size / 2,
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                ],
                opacity: particle.opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  particle: {
    position: 'absolute',
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Android shadow - reduced
  },
});

export default FlickeringParticles;


import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {t} from '../i18n';

const PARTICLE_COUNT = 12;
const EMOJIS = ['🎉', '🎊', '✨', '⭐', '🌟', '💫'];

interface CelebrationOverlayProps {
  visible: boolean;
  onFinish: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  visible,
  onFinish,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const particles = useRef(
    Array.from({length: PARTICLE_COUNT}, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    // Main text animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      // Particle animations
      Animated.parallel(
        particles.map((p, i) => {
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
          const distance = 80 + Math.random() * 60;
          return Animated.parallel([
            Animated.timing(p.x, {
              toValue: Math.cos(angle) * distance,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(p.y, {
              toValue: Math.sin(angle) * distance - 30,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 800,
              delay: 200,
              useNativeDriver: true,
            }),
            Animated.timing(p.rotate, {
              toValue: Math.random() * 4 - 2,
              duration: 800,
              useNativeDriver: true,
            }),
          ]);
        }),
      ),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset values
      scale.setValue(0.5);
      particles.forEach(p => {
        p.x.setValue(0);
        p.y.setValue(0);
        p.opacity.setValue(1);
        p.rotate.setValue(0);
      });
      onFinish();
    });
  }, [visible, opacity, scale, particles, onFinish]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.particle,
            {
              opacity: p.opacity,
              transform: [
                {translateX: p.x},
                {translateY: p.y},
                {
                  rotate: p.rotate.interpolate({
                    inputRange: [-2, 2],
                    outputRange: ['-180deg', '180deg'],
                  }),
                },
              ],
            },
          ]}>
          {EMOJIS[i % EMOJIS.length]}
        </Animated.Text>
      ))}
      <Animated.View
        style={[
          styles.textContainer,
          {opacity, transform: [{scale}]},
        ]}>
        <Text style={styles.celebrationEmoji}>🎯</Text>
        <Text style={styles.celebrationText}>{t('goalReached')}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  textContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#10B981',
  },
  particle: {
    position: 'absolute',
    fontSize: 24,
  },
});

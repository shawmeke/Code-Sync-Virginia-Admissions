import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  // 0–100: how much of the ring is filled.
  value: number;
  size: number;
  strokeWidth: number;
  color: string;
  trackColor: string;
  // Shown in the middle of the ring, e.g. the score.
  children?: ReactNode;
};

// A circular progress ring that fills to `value` when it appears and glides
// to a new value when it changes. Stays still when the device asks for
// reduced motion.
export function ScoreRing({ value, size, strokeWidth, color, trackColor, children }: Props) {
  const reduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(reduceMotion ? value : 0);

  useEffect(() => {
    // The short delay lets the screen finish sliding in, so the fill is seen.
    progress.value = reduceMotion
      ? value
      : withDelay(350, withTiming(value, { duration: 1000, easing: Easing.out(Easing.cubic) }));
  }, [value, reduceMotion, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - Math.min(100, Math.max(0, progress.value)) / 100),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          // Start the ring at 12 o'clock instead of 3 o'clock.
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children && <View style={styles.center}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});

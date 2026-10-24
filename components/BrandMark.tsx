import Svg, { Path, Rect } from 'react-native-svg';

import { ScoreRing } from '@/components/ScoreRing';

// The Code-Sync logo: the app icon's column building inside a match ring.
// Drawn in the same coordinates as assets/images/icon.png so the two match.
export function BrandMark({ size, color, trackColor, ink }: { size: number; color: string; trackColor: string; ink: string }) {
  const glyph = size * 0.48;
  return (
    <ScoreRing value={78} size={size} strokeWidth={size * 0.075} color={color} trackColor={trackColor}>
      <Svg width={glyph} height={glyph} viewBox="320 300 384 384" accessibilityElementsHidden importantForAccessibility="no">
        <Path d="M512 318 L690 424 L334 424 Z" fill={ink} stroke={ink} strokeWidth={14} strokeLinejoin="round" />
        <Rect x={340} y={436} width={344} height={26} rx={6} fill={ink} />
        {[384, 469, 555, 640].map((x) => (
          <Rect key={x} x={x - 21} y={474} width={42} height={150} rx={6} fill={ink} />
        ))}
        <Rect x={326} y={636} width={372} height={34} rx={10} fill={ink} />
      </Svg>
    </ScoreRing>
  );
}

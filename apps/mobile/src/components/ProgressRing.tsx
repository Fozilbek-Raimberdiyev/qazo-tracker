import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '../theme/ThemeContext'

type Props = {
  size?: number
  strokeWidth?: number
  progress: number // 0–100
  color?: string
  label?: string
  sublabel?: string
}

export default function ProgressRing({
  size = 80,
  strokeWidth = 7,
  progress,
  color,
  label,
  sublabel,
}: Props) {
  const { theme } = useTheme()
  const c = color ?? theme.colors.primary
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={c}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {label !== undefined && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 15 }}>
            {label}
          </Text>
          {sublabel !== undefined && (
            <Text style={{ color: theme.colors.textMuted, fontSize: 10 }}>{sublabel}</Text>
          )}
        </View>
      )}
    </View>
  )
}

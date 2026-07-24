/**
 * SiteBrain AI Enterprise Design System - Color Tokens
 * Primary: White, Slate, Navy
 * Accent: Construction Orange (#F97316 / #EA580C)
 */

export const colors = {
  // Primary Palette
  white: '#FFFFFF',
  navy: {
    50: '#F0F4F8',
    100: '#D9E2EC',
    800: '#102A43',
    900: '#0A192F',
    950: '#060D1A',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  // Accent Construction Orange
  construction: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
  },
  // Status Colors
  status: {
    success: '#15803D',
    successBg: '#F0FDF4',
    warning: '#B45309',
    warningBg: '#FFFBEB',
    danger: '#B91C1C',
    dangerBg: '#FEF2F2',
    info: '#1D4ED8',
    infoBg: '#EFF6FF',
  },
} as const;

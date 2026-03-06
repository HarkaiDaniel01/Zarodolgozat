export const lightColors = {
  primary: '#6C5CE7',
  primary_light: '#A29BFE',
  secondary: '#00C853',
  accent: '#FFD700',
  
  background: '#F4F6FB',
  surface: '#FFFFFF',
  
  text: '#1A1A2E',
  text_secondary: '#6B7280',
  text_inverted: '#FFFFFF',
  
  border: '#E5E7EB',

  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  gradient_start: '#6C5CE7',
  gradient_mid: '#5A4BD1',
  gradient_end: '#4A148C',
};

export const darkColors = {
  primary: '#A29BFE',
  primary_light: '#6C5CE7',
  secondary: '#69F0AE',
  accent: '#FFD700',

  background: '#121212',
  surface: '#1E1E1E',

  text: '#FFFFFF',
  text_secondary: '#A0A0A0',
  text_inverted: '#FFFFFF',

  border: '#3A3A3A',

  success: '#81C784',
  warning: '#FFB74D',
  error: '#E57373',

  gradient_start: '#2D2060',
  gradient_mid: '#1E1545',
  gradient_end: '#130D30',
};

export const FONT_SIZES = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  caption: 14,
  small: 12,
};

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
  black: '800',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 999,
};

// Base design width (iPhone 14 Pro). Font sizes scale proportionally.
const BASE_WIDTH = 390;

/**
 * Responsive font size — scales a base size to the device screen width.
 * Clamped between 80 % and 125 % of the original value.
 */
export const rf = (size: number, width: number): number => {
  const scale = width / BASE_WIDTH;
  const scaled = size * scale;
  return Math.round(Math.max(size * 0.8, Math.min(scaled, size * 1.25)));
};

const theme = {
  lightColors,
  darkColors,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
};

export default theme;

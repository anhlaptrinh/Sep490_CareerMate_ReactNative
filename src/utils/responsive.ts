import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const baseWidth = 375;
const baseHeight = 812;

export const scaleWidth = (size: number): number => (SCREEN_WIDTH / baseWidth) * size;
export const scaleHeight = (size: number): number => (SCREEN_HEIGHT / baseHeight) * size;

export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  if (scale < 0.85) return Math.round(size * 0.85);
  if (scale > 1.3) return Math.round(size * 1.3);
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

export const scale = (size: number): number => {
  const scaleRatio = Math.min(SCREEN_WIDTH / baseWidth, SCREEN_HEIGHT / baseHeight);
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleRatio));
};

export const vs = (size: number): number => scaleHeight(size);
export const hs = (size: number): number => scaleWidth(size);
export const ms = (size: number, factor: number = 0.5): number => size + (scale(size) - size) * factor;

export const deviceInfo = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

type StyleValue = number | string | undefined | boolean | object;
type StyleObject = { [key: string]: StyleValue };

const PROPERTIES_NOT_TO_SCALE = ['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'aspectRatio', 'opacity', 'elevation', 'shadowOpacity', 'zIndex', 'fontWeight', 'transform'];
const HORIZONTAL_PROPERTIES = ['width', 'minWidth', 'maxWidth', 'marginLeft', 'marginRight', 'marginHorizontal', 'paddingLeft', 'paddingRight', 'paddingHorizontal', 'left', 'right'];
const VERTICAL_PROPERTIES = ['height', 'minHeight', 'maxHeight', 'marginTop', 'marginBottom', 'marginVertical', 'paddingTop', 'paddingBottom', 'paddingVertical', 'top', 'bottom', 'lineHeight'];
const FONT_PROPERTIES = ['fontSize', 'letterSpacing'];
const SCALE_PROPERTIES = ['margin', 'padding', 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderWidth', 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'shadowRadius', 'gap'];

function scaleStyleValue(property: string, value: StyleValue): StyleValue {
  if (typeof value !== 'number') return value;
  if (PROPERTIES_NOT_TO_SCALE.includes(property)) return value;
  if (FONT_PROPERTIES.includes(property)) return scaleFont(value);
  if (HORIZONTAL_PROPERTIES.includes(property)) return hs(value);
  if (VERTICAL_PROPERTIES.includes(property)) return vs(value);
  if (SCALE_PROPERTIES.includes(property)) return scale(value);
  return value;
}

function processStyle(style: StyleObject): StyleObject {
  const scaledStyle: StyleObject = {};
  for (const [key, value] of Object.entries(style)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      scaledStyle[key] = processStyle(value as StyleObject);
    } else if (Array.isArray(value)) {
      scaledStyle[key] = value;
    } else {
      scaledStyle[key] = scaleStyleValue(key, value);
    }
  }
  return scaledStyle;
}

export function createResponsiveStyles<T extends { [key: string]: StyleObject }>(styles: T): T {
  const responsiveStyles: any = {};
  for (const [styleName, styleObject] of Object.entries(styles)) {
    responsiveStyles[styleName] = processStyle(styleObject);
  }
  return responsiveStyles as T;
}

export const ResponsiveStyleSheet = {
  create: createResponsiveStyles,
};

export default {
  scale,
  scaleWidth,
  scaleHeight,
  scaleFont,
  vs,
  hs,
  ms,
  deviceInfo,
  createResponsiveStyles,
  ResponsiveStyleSheet,
};

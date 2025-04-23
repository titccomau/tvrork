import { Platform, Dimensions } from "react-native";

export function isTVDevice(): boolean {
  // Check if running on a TV device
  if (Platform.isTV) {
    return true;
  }
  
  // Additional check for Android TV
  if (Platform.OS === "android") {
    const { width, height } = Dimensions.get("window");
    // Most TV screens are large and have specific aspect ratios
    // This is a simple heuristic that can be improved
    return width >= 960 && height >= 540;
  }
  
  return false;
}

export function isLeanbackSupported(): boolean {
  return Platform.OS === "android" && isTVDevice();
}

export function getTVFocusProperties(isDefault: boolean = false) {
  if (isTVDevice()) {
    return {
      hasTVPreferredFocus: isDefault,
      tvParallaxProperties: { enabled: false },
      accessible: true,
      accessibilityRole: "button",
    };
  }
  return {};
}

// TV-specific styles
export const tvStyles = {
  // Larger focus ring for TV navigation
  focusRing: {
    borderWidth: 3,
    borderColor: "#4361ee",
    borderRadius: 8,
  },
  
  // Larger text for TV viewing distance
  text: {
    fontSize: 18,
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  
  // Larger touch targets for remote navigation
  touchable: {
    minHeight: 60,
    minWidth: 60,
    padding: 16,
    margin: 8,
  },
  
  // Card styles optimized for TV
  card: {
    padding: 16,
    margin: 12,
    borderRadius: 8,
  },
};

// Helper to get appropriate styles based on platform
export function getPlatformStyles(tvStyle: any, mobileStyle: any) {
  return isTVDevice() ? tvStyle : mobileStyle;
}

// Calculate appropriate font size based on platform
export function getFontSize(baseFontSize: number): number {
  return isTVDevice() ? baseFontSize * 1.5 : baseFontSize;
}

// Calculate appropriate spacing based on platform
export function getSpacing(baseSpacing: number): number {
  return isTVDevice() ? baseSpacing * 1.5 : baseSpacing;
}
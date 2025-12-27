export const EXTENSION_ID = 'circlecodesolution.ccs-flutter-color';
export const PROXY_URL = 'http://65.1.61.75:8080';
export const FLUTTER_COLOR_REGEX = /(0x[a-f0-9A-F]{8})/;
export const HEX_COLOR_REGEX = /(#[a-f0-9A-F]{6,8})/;
export const RGB_COLOR_DETECTION_REGEX = /(rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:\d+)?\.?\d+)?\s*\))/;
export const RGB_COLOR_PARSING_REGEX = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*((?:\d+)?\.?\d+))?\s*\)/;
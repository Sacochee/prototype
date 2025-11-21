const cssColors: Record<string, string> = {
  black: "000000",
  white: "FFFFFF",
  red: "FF0000",
  blue: "0000FF",
  green: "008000",
  yellow: "FFFF00",
  gray: "808080",
  lightgray: "D3D3D3",
  darkgray: "A9A9A9",
  orange: "FFA500",
  pink: "FFC0CB",
  purple: "800080",
  brown: "A52A2A",
  cyan: "00FFFF",
  magenta: "FF00FF",
};


export function cssColorToHex(color: string): string {
  if (!color) return "000000";
  if (color.startsWith("#")) return color.replace("#", "").toUpperCase();
  return cssColors[color.toLowerCase()] || "000000";
}

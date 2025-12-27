import { Color, workspace } from "vscode";
import { RGB_COLOR_DETECTION_REGEX, RGB_COLOR_PARSING_REGEX } from "../constant";
import BaseColorStrategy from "./baseColorStratergy";

class RGBColorStrategy extends BaseColorStrategy {
  getRegex(): RegExp {
    return RGB_COLOR_DETECTION_REGEX;
  }

  parseColor(match: string): { r: number; g: number; b: number; o: number } {
    // Extract RGB and alpha values using regex
    const result = match.match(RGB_COLOR_PARSING_REGEX);

    if (!result) {
      throw new Error(`Invalid RGB color format: ${match}`);
    }

    // Extract RGB values (0-255 range)
    const r = this.clamp(parseInt(result[1], 10), 0, 255);
    const g = this.clamp(parseInt(result[2], 10), 0, 255);
    const b = this.clamp(parseInt(result[3], 10), 0, 255);

    // Extract alpha value (0-1 range), default to 1 if not specified
    let o = 255;
    if (result[4] !== undefined) {
      const alpha = parseFloat(result[4]);
      o = Math.round(this.clamp(alpha, 0, 1) * 255);
    }

    return { r, g, b, o };
  }

  protected formatColorLabel(
    _toHex: (value: number) => string,
    color: Color
  ): string {
    // Get configuration
    const config = workspace.getConfiguration();
    const spacing = config.get("flutterColor.rgbSpacing") === "compact" ? "," : ", ";

    // Convert normalized color values (0-1) back to 0-255 range
    const r = Math.round(color.red * 255);
    const g = Math.round(color.green * 255);
    const b = Math.round(color.blue * 255);

    // Use rgb() when fully opaque, rgba() when transparent
    if (color.alpha === 1) {
      return `rgb(${r}${spacing}${g}${spacing}${b})`;
    } else {
      // Round alpha to 2 decimal places and remove trailing zeros
      const a = parseFloat(color.alpha.toFixed(2));
      return `rgba(${r}${spacing}${g}${spacing}${b}${spacing}${a})`;
    }
  }

  /**
   * Clamps a value between min and max
   */
  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

export default RGBColorStrategy;

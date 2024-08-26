import { Color } from "vscode";

export interface ColorStrategy {
  getRegex(): RegExp;
  parseColor(match: string): { r: number; g: number; b: number; o: number };
  formatColor(color: Color): string;
}

abstract class BaseColorStrategy implements ColorStrategy {
  abstract getRegex(): RegExp;

  abstract parseColor(match: string): {
    r: number;
    g: number;
    b: number;
    o: number;
  };

  formatColor(color: Color): string {
    const toHex = (value: number) => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return this.formatColorLabel(toHex, color);
  }

  protected abstract formatColorLabel(
    toHex: (value: number) => string,
    color: Color
  ): string;
}

export default BaseColorStrategy;

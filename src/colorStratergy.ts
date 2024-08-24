import { Color } from "vscode";

interface ColorStrategy {
    getRegex(): RegExp;
    parseColor(match: string): { r: number, g: number, b: number, o: number };
    formatColor(color: Color): string;
}

export default ColorStrategy;
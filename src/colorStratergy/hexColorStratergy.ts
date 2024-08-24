import { Color } from "vscode";
import BaseColorStrategy from "./baseColorStratergy";

class HexColorStrategy extends BaseColorStrategy {
    getRegex(): RegExp {
        return /(#[a-f0-9A-F]{6,8})/;
    }

    parseColor(match: string): { r: number, g: number, b: number, o: number } {
        const hex = match.replace('#', '');
        const arrBuff = new ArrayBuffer(4);
        const vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        const arrByte = new Uint8Array(arrBuff);
        if (hex.length === 6) {
            return { r: arrByte[1], g: arrByte[2], b: arrByte[3], o: 255 };
        }
        return { r: arrByte[1], g: arrByte[2], b: arrByte[3], o: arrByte[0] };
    }

    protected formatColorLabel(toHex: (value: number) => string, color: Color): string {
        const colorLabel = color.alpha === 1
            ? `${toHex(color.red)}${toHex(color.green)}${toHex(color.blue)}`
            : `${toHex(color.alpha)}${toHex(color.red)}${toHex(color.green)}${toHex(color.blue)}`;

        return '#' + colorLabel.toUpperCase();
    }
}

export default HexColorStrategy;
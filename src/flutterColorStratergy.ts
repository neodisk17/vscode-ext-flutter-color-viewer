import { Color } from "vscode";
import BaseColorStrategy from "./baseColorStratergy";

class FlutterColorStrategy extends BaseColorStrategy {
    getRegex(): RegExp {
        return /(0x[a-f0-9A-F]{8})/;
    }

    parseColor(match: string): { r: number, g: number, b: number, o: number } {
        const arrBuff = new ArrayBuffer(4);
        const vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(match.substring(2), 16), false);
        const arrByte = new Uint8Array(arrBuff);
        return { r: arrByte[1], g: arrByte[2], b: arrByte[3], o: arrByte[0] };
    }

    protected formatColorLabel(toHex: (value: number) => string, color: Color): string {
        const colorLabel = `${toHex(color.alpha)}${toHex(color.red)}${toHex(color.green)}${toHex(color.blue)}`;
        return '0x' + colorLabel.toUpperCase();
    }
}

export default FlutterColorStrategy;
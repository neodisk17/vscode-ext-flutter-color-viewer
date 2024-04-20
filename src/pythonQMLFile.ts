import {
    DocumentColorProvider,
    TextDocument,
    ProviderResult,
    Color,
    ColorPresentation,
    ColorInformation,
    Range,
    Position
} from "vscode";
import { sendTrackingEvent } from "./tracking";
import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";


class PythonQMLShow implements DocumentColorProvider {
    rgbToHex(rgb: number) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }

    hexToRgbNew(hex: string) {
        hex = hex.replace('#', '');
        var arrBuff = new ArrayBuffer(4);
        var vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        var arrByte = new Uint8Array(arrBuff);
        if (hex.length === 6) {
            return { r: arrByte[1], g: arrByte[2], b: arrByte[3], o: 255 };
        }
        return { r: arrByte[1], g: arrByte[2], b: arrByte[3], o: arrByte[0] };
    }

    provideDocumentColors(document: TextDocument): ProviderResult<ColorInformation[]> {
        console.log("Python QML color is called");
        let list = ['dart', 'css', 'less', 'scss'];
        if (list.indexOf(document.languageId) > -1) {
            return;
        }
        let colorArr: ColorInformation[] = [];
        let sourceCode = document.getText();
        const sourceCodeArr = sourceCode.split('\n');
        let regex = /(#[a-f0-9A-F]{6,8})/;
        for (let line = 0; line < sourceCodeArr.length; line++) {
            let match = sourceCodeArr[line].match(regex);
            while (match !== null && match.index !== undefined) {
                let range = new Range(
                    new Position(line, match.index),
                    new Position(line, match.index + match[1].length)
                );
                var rgbColor = this.hexToRgbNew(match[1]);
                sourceCodeArr[line] = sourceCodeArr[line].replace(match[1], (new Array(match[1].length)).fill('*').join(''));
                let colorCode = new ColorInformation(range, new Color(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255, rgbColor.o / 255));

                colorArr.push(colorCode);
                match = sourceCodeArr[line].match(regex);
            }
        }
        sendTrackingEvent(TelemetryEnum.colorPickerUsed, {
            color: colorArr[0].color,
            colorPickerType: 'all'
        }, TelemetryTypeEnum.editor);
        return colorArr;
    }

    provideColorPresentations(color: Color): ProviderResult<ColorPresentation[]> {
        let colorObj = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        };
        colorObj.red = color.red * 255;
        colorObj.green = color.green * 255;
        colorObj.blue = color.blue * 255;
        colorObj.alpha = Math.round(color.alpha * 255);
        let colorLabel;
        if (colorObj.alpha === 255) {
            colorLabel = String(String(this.rgbToHex(colorObj.red)) + String(this.rgbToHex(colorObj.green)) + String(this.rgbToHex(colorObj.blue)));
        }
        else {
            colorLabel = String(String(this.rgbToHex(colorObj.alpha)+this.rgbToHex(colorObj.red)) + String(this.rgbToHex(colorObj.green)) + String(this.rgbToHex(colorObj.blue)));
        }
        return [new ColorPresentation('#' + colorLabel.toLocaleUpperCase())];
    }
}
export default PythonQMLShow;
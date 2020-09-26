import {
    DocumentColorProvider,
    TextDocument,
    CancellationToken,
    ProviderResult,
    Color,
    ColorPresentation,
    ColorInformation,
    Range,
    Position
} from "vscode";
class JSONColorShow implements DocumentColorProvider {
    rgbToHex(rgb: number) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }
    hexToRgbNew(hex: string) {
        hex = hex.replace('#', '')
        var arrBuff = new ArrayBuffer(4);
        var vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        var arrByte = new Uint8Array(arrBuff);
        if (hex.length === 6) {
            return { r: arrByte[1], g: arrByte[2], b: arrByte[3], o: 255 };
        }
        return { r: arrByte[0], g: arrByte[1], b: arrByte[2], o: arrByte[3] };
    }
    provideDocumentColors(document: TextDocument, token: CancellationToken): ProviderResult<ColorInformation[]> {
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
                sourceCodeArr[line] = sourceCodeArr[line].replace(match[1], (new Array(match[1].length)).fill('*').join(''))
                let colorCode = new ColorInformation(range, new Color(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255, rgbColor.o / 255));

                colorArr.push(colorCode);
                match = sourceCodeArr[line].match(regex);
            }
        }
        return colorArr;
        throw new Error("Method not implemented.");
    }
    provideColorPresentations(color: Color, context: { document: TextDocument; range: Range; }, token: CancellationToken): ProviderResult<ColorPresentation[]> {
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
        var s1 = String(this.rgbToHex(colorObj.red))
        var s2 = String(this.rgbToHex(colorObj.green))
        var s3 = String(this.rgbToHex(colorObj.blue))
        var s4 = String(this.rgbToHex(colorObj.alpha))
        let colorLabel
        if (colorObj.alpha === 255) {
            colorLabel = String(String(this.rgbToHex(colorObj.red)) + String(this.rgbToHex(colorObj.green)) + String(this.rgbToHex(colorObj.blue)));
        }
        else {
            colorLabel = String(String(this.rgbToHex(colorObj.red)) + String(this.rgbToHex(colorObj.green)) + String(this.rgbToHex(colorObj.blue) + this.rgbToHex(colorObj.alpha)));
        }
        return [new ColorPresentation('#' + colorLabel.toLocaleUpperCase())];
        throw new Error("Method not implemented.");
    }
}
export default JSONColorShow;
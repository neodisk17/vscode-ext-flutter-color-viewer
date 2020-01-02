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
class FlutterColorShow implements DocumentColorProvider {
    rgbToHex(rgb: number) { 
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
             hex = "0" + hex;
        }
        return hex;
    }
    hexToRgbNew(hex:string) {
        var arrBuff = new ArrayBuffer(4);
        var vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        var arrByte = new Uint8Array(arrBuff);

        return {r:arrByte[1],g: arrByte[2],b: arrByte[3],o:arrByte[0]};
    }
    provideDocumentColors(document: TextDocument, token: CancellationToken): ProviderResult<ColorInformation[]> {
        let colorArr: ColorInformation[] = [];
        let sourceCode = document.getText();
        const sourceCodeArr = sourceCode.split('\n');
        let regex = /(0x[a-f0-9A-F]{8})/;
        for (let line = 0; line < sourceCodeArr.length; line++) {
            let match = sourceCodeArr[line].match(regex);

            if (match !== null && match.index !== undefined) {
                let range = new Range(
                    new Position(line, match.index),
                    new Position(line, match.index + match[1].length)
                );
                var rgbColor=this.hexToRgbNew(match[1]);
                let colorCode = new ColorInformation(range, new Color(rgbColor.r/255, rgbColor.g/255, rgbColor.b/255, rgbColor.o/255));

                colorArr.push(colorCode);
            }
        }
        return colorArr;
        throw new Error("Method not implemented.");
    }
    provideColorPresentations(color: Color, context: { document: TextDocument; range: Range; }, token: CancellationToken): ProviderResult<ColorPresentation[]> {
        let colorObj={
            red:0,
            green:0,
            blue:0
        };
        colorObj.red=color.red*255;
        colorObj.green=color.green*255;
        colorObj.blue=color.blue*255;
        let colorLabel=String(this.rgbToHex(colorObj.red)) +String(this.rgbToHex(colorObj.green)) +String(this.rgbToHex(colorObj.blue)); 
        return [new ColorPresentation('0xFF'+colorLabel.toLocaleUpperCase())];
        throw new Error("Method not implemented.");
    }
}
export default FlutterColorShow;
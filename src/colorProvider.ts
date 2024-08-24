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
import ColorStrategy from "./colorStratergy";
import HexColorStrategy from "./hexColorStratergy";
import FlutterColorStrategy from "./flutterColorStratergy";

class UnifiedColorProvider implements DocumentColorProvider {
    private strategies: Map<string, ColorStrategy> = new Map();

    constructor() {
        this.strategies.set('default', new HexColorStrategy());
        this.strategies.set('flutter', new FlutterColorStrategy());
    }

    private getStrategy(document: TextDocument): ColorStrategy {
        return document.languageId === 'dart' ? this.strategies.get('flutter')! : this.strategies.get('default')!;
    }

    provideDocumentColors(document: TextDocument): ProviderResult<ColorInformation[]> {
        const excludedLanguages = ['css', 'less', 'scss'];
        if (excludedLanguages.includes(document.languageId)) {
            return;
        }

        const strategy = this.getStrategy(document);
        const colorArr = this.extractColors(document, strategy);

        this.sendTrackingEvent(document, colorArr);

        return colorArr;
    }

    private extractColors(document: TextDocument, strategy: ColorStrategy): ColorInformation[] {
        const colorArr: ColorInformation[] = [];
        const sourceCode = document.getText();
        const sourceCodeArr = sourceCode.split('\n');
        const regex = strategy.getRegex();

        for (let line = 0; line < sourceCodeArr.length; line++) {
            this.extractColorsFromLine(line, sourceCodeArr, regex, strategy, colorArr);
        }

        return colorArr;
    }

    private extractColorsFromLine(line: number, sourceCodeArr: string[], regex: RegExp, strategy: ColorStrategy, colorArr: ColorInformation[]): void {
        let match = sourceCodeArr[line].match(regex);
        while (match !== null && match.index !== undefined) {
            const range = new Range(
                new Position(line, match.index),
                new Position(line, match.index + match[1].length)
            );
            const rgbColor = strategy.parseColor(match[1]);
            sourceCodeArr[line] = sourceCodeArr[line].replace(match[1], (new Array(match[1].length)).fill('*').join(''));
            const colorCode = new ColorInformation(range, new Color(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255, rgbColor.o / 255));

            colorArr.push(colorCode);
            match = sourceCodeArr[line].match(regex);
        }
    }

    private sendTrackingEvent(document: TextDocument, colorArr: ColorInformation[]): void {
        sendTrackingEvent(TelemetryEnum.colorPickerUsed, {
            color: colorArr[0]?.color,
            colorPickerType: document.languageId === 'dart' ? 'flutter' : 'all'
        }, TelemetryTypeEnum.editor);
    }

    provideColorPresentations(color: Color, context: { document: TextDocument }): ProviderResult<ColorPresentation[]> {
        const strategy = this.getStrategy(context.document);
        const colorLabel = strategy.formatColor(color);
        return [new ColorPresentation(colorLabel)];
    }
}

export default UnifiedColorProvider;

import {
  DocumentColorProvider,
  TextDocument,
  ProviderResult,
  Color,
  ColorPresentation,
  ColorInformation,
  Range,
  Position,
} from "vscode";
import { sendTrackingEvent } from "./tracking";
import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";
import { ColorStrategy } from "./colorStratergy/baseColorStratergy";
import FlutterColorStrategy from "./colorStratergy/flutterColorStratergy";
import HexColorStrategy from "./colorStratergy/hexColorStratergy";
import ARGBColorStrategy from "./colorStratergy/argbColorStratergy";

class UnifiedColorProvider implements DocumentColorProvider {
  private strategies: Map<string, ColorStrategy> = new Map();

  constructor() {
    this.strategies.set("default", new HexColorStrategy());
    this.strategies.set("flutter", new FlutterColorStrategy());
    this.strategies.set("argb", new ARGBColorStrategy());
  }

  private getStrategy(document: TextDocument): ColorStrategy {
    const languageId = document.languageId;
    let colorStrategy;
    switch (languageId) {
      case "dart":
        colorStrategy = this.strategies.get("flutter");
        break;
      case "qml":
        colorStrategy = this.strategies.get("argb");
        break;
    }
    return colorStrategy || this.strategies.get("default")!;
  }

  provideDocumentColors(
    document: TextDocument
  ): ProviderResult<ColorInformation[]> {
    const excludedLanguages = ["css", "less", "scss"];
    if (excludedLanguages.includes(document.languageId)) {
      return;
    }

    const strategy = this.getStrategy(document);
    const colorArr = this.extractColors(document, strategy);

    this.sendTrackingEvent(document, colorArr);

    return colorArr;
  }

  private extractColors(
    document: TextDocument,
    strategy: ColorStrategy
  ): ColorInformation[] {
    const colorArr: ColorInformation[] = [];
    const sourceCode = document.getText();
    const sourceCodeArr = sourceCode.split("\n");
    const regex = strategy.getRegex();

    sourceCodeArr.forEach((_, lineIndex) => {
      this.extractColorsFromLine(
        lineIndex,
        sourceCodeArr,
        regex,
        strategy,
        colorArr
      );
    });

    return colorArr;
  }

  private extractColorsFromLine(
    line: number,
    sourceCodeArr: string[],
    regex: RegExp,
    strategy: ColorStrategy,
    colorArr: ColorInformation[]
  ): void {
    let match = sourceCodeArr[line].match(regex);
    while (match !== null && match.index !== undefined) {
      const range = new Range(
        new Position(line, match.index),
        new Position(line, match.index + match[1].length)
      );
      const rgbColor = strategy.parseColor(match[1]);
      sourceCodeArr[line] = sourceCodeArr[line].replace(
        match[1],
        new Array(match[1].length).fill("*").join("")
      );
      const colorCode = new ColorInformation(
        range,
        new Color(
          rgbColor.r / 255,
          rgbColor.g / 255,
          rgbColor.b / 255,
          rgbColor.o / 255
        )
      );

      colorArr.push(colorCode);
      match = sourceCodeArr[line].match(regex);
    }
  }

  private sendTrackingEvent(
    document: TextDocument,
    colorArr: ColorInformation[]
  ): void {
    sendTrackingEvent(
      TelemetryEnum.colorPickerUsed,
      {
        color: colorArr[0]?.color,
        colorPickerType: document.languageId === "dart" ? "flutter" : "all",
      },
      TelemetryTypeEnum.editor
    );
  }

  provideColorPresentations(
    color: Color,
    context: { document: TextDocument }
  ): ProviderResult<ColorPresentation[]> {
    const strategy = this.getStrategy(context.document);
    const colorLabel = strategy.formatColor(color);
    return [new ColorPresentation(colorLabel)];
  }
}

export default UnifiedColorProvider;

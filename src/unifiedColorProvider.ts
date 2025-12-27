import {
  DocumentColorProvider,
  TextDocument,
  ProviderResult,
  Color,
  ColorPresentation,
  ColorInformation,
  Range,
  Position,
  workspace,
} from "vscode";
import { sendTrackingEvent } from "./tracking";
import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";
import { ColorStrategy } from "./colorStratergy/baseColorStratergy";
import FlutterColorStrategy from "./colorStratergy/flutterColorStratergy";
import HexColorStrategy from "./colorStratergy/hexColorStratergy";
import ARGBColorStrategy from "./colorStratergy/argbColorStratergy";
import RGBColorStrategy from "./colorStratergy/rgbColorStratergy";

class UnifiedColorProvider implements DocumentColorProvider {
  private strategies: Map<string, ColorStrategy> = new Map();

  constructor() {
    this.strategies.set("default", new HexColorStrategy());
    this.strategies.set("flutter", new FlutterColorStrategy());
    this.strategies.set("argb", new ARGBColorStrategy());
    this.strategies.set("rgb", new RGBColorStrategy());
  }

  private getStrategies(document: TextDocument): ColorStrategy[] {
    const strategies: ColorStrategy[] = [];
    const languageId = document.languageId;

    // Add language-specific strategy first
    switch (languageId) {
      case "dart":
        strategies.push(this.strategies.get("flutter")!);
        break;
      case "qml":
        strategies.push(this.strategies.get("argb")!);
        break;
      default:
        strategies.push(this.strategies.get("default")!);
    }

    // Always add RGB strategy for all languages
    const config = workspace.getConfiguration();
    if (config.get("flutterColor.enableRgbSupport", true)) {
      strategies.push(this.strategies.get("rgb")!);
    }

    return strategies;
  }

  provideDocumentColors(
    document: TextDocument
  ): ProviderResult<ColorInformation[]> {
    const excludedLanguages = ["css", "less", "scss"];
    if (excludedLanguages.includes(document.languageId)) {
      return;
    }

    const strategies = this.getStrategies(document);
    const colorArr = this.extractColors(document, strategies);

    this.sendTrackingEvent(document, colorArr);

    return colorArr;
  }

  private extractColors(
    document: TextDocument,
    strategies: ColorStrategy[]
  ): ColorInformation[] {
    const colorArr: ColorInformation[] = [];
    const sourceCode = document.getText();

    // Extract colors using all strategies
    strategies.forEach((strategy) => {
      const regex = strategy.getRegex();
      const sourceCodeArr = sourceCode.split("\n");

      sourceCodeArr.forEach((_, lineIndex) => {
        this.extractColorsFromLine(
          lineIndex,
          sourceCodeArr,
          regex,
          strategy,
          colorArr
        );
      });
    });

    // Deduplicate colors at the same position
    return this.deduplicateColors(colorArr);
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

  /**
   * Removes duplicate colors at the same position
   * When multiple strategies match the same color, keep only the first one
   */
  private deduplicateColors(colors: ColorInformation[]): ColorInformation[] {
    const seen = new Map<string, ColorInformation>();

    colors.forEach((color) => {
      const key = `${color.range.start.line}:${color.range.start.character}`;
      if (!seen.has(key)) {
        seen.set(key, color);
      }
    });

    return Array.from(seen.values());
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
    const strategies = this.getStrategies(context.document);
    const presentations: ColorPresentation[] = [];

    // Create a color presentation for each strategy
    strategies.forEach((strategy) => {
      const colorLabel = strategy.formatColor(color);
      presentations.push(new ColorPresentation(colorLabel));
    });

    return presentations;
  }
}

export default UnifiedColorProvider;

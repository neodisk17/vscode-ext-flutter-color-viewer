import * as assert from "assert";
import { TextDocument, ColorInformation, Color } from "vscode";
import UnifiedColorProvider from "../unifiedColorProvider";

suite("UnifiedColorProvider Test Suite", () => {
  let provider: UnifiedColorProvider;

  setup(() => {
    provider = new UnifiedColorProvider();
  });

  test("provideDocumentColors should return colors for dart file", () => {
    const mockDocument = {
      languageId: "dart",
      getText: () => "Color(0xFF123456)",
    } as TextDocument;

    const colors = provider.provideDocumentColors(mockDocument);

    assert.ok(Array.isArray(colors));
    assert.strictEqual(colors.length, 1);
    assert.ok(colors[0] instanceof ColorInformation);
  });

  test("provideColorPresentations should return color presentation", () => {
    const mockContext = {
      document: { languageId: "dart" } as TextDocument,
    };
    const color = new Color(0.1, 0.2, 0.3, 1);

    const presentations = provider.provideColorPresentations(
      color,
      mockContext
    );

    assert.ok(Array.isArray(presentations));
    assert.strictEqual(presentations.length, 1);
    assert.strictEqual(presentations[0].label, "0xFF1A334D");
  });

  test("should use HexColorStrategy for default language", () => {
    const mockDocument = {
      languageId: "javascript",
      getText: () => "#123456",
    } as TextDocument;

    const colors = provider.provideDocumentColors(mockDocument);

    assert.ok(Array.isArray(colors));
    assert.strictEqual(colors.length, 1);
    assert.ok(colors[0] instanceof ColorInformation);
    assert.strictEqual(colors[0].color.red, 18 / 255);
    assert.strictEqual(colors[0].color.green, 52 / 255);
    assert.strictEqual(colors[0].color.blue, 86 / 255);
  });

  test("should use ARGBColorStrategy for qml language", () => {
    const mockDocument = {
      languageId: "qml",
      getText: () => "#FF123456",
    } as TextDocument;

    const colors = provider.provideDocumentColors(mockDocument);

    assert.ok(Array.isArray(colors));
    assert.strictEqual(colors.length, 1);
    assert.ok(colors[0] instanceof ColorInformation);
    assert.strictEqual(colors[0].color.red, 18 / 255);
    assert.strictEqual(colors[0].color.green, 52 / 255);
    assert.strictEqual(colors[0].color.blue, 86 / 255);
    assert.strictEqual(colors[0].color.alpha, 1);
  });
});

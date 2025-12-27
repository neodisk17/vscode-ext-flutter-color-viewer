import * as assert from "assert";
import { Color } from "vscode";
import HexColorStrategy from "../colorStratergy/hexColorStratergy";
import FlutterColorStrategy from "../colorStratergy/flutterColorStratergy";
import ARGBColorStrategy from "../colorStratergy/argbColorStratergy";
import RGBColorStrategy from "../colorStratergy/rgbColorStratergy";
import {
  mockWorkspaceConfiguration,
  restoreWorkspaceConfiguration,
} from "./configTestUtils";

suite("ColorStrategy Test Suite", () => {
  test("HexColorStrategy should parse and format colors without alpha correctly", () => {
    const strategy = new HexColorStrategy();

    const parsedColorWithAlpha = strategy.parseColor("ffdd12");
    assert.deepStrictEqual(parsedColorWithAlpha, {
      r: 255,
      g: 221,
      b: 18,
      o: 255,
    });

    const formattedColorWithAlpha = strategy.formatColor(
      new Color(0.1, 0.2, 0.3, 0)
    );
    assert.strictEqual(formattedColorWithAlpha, "#1A334D00");
  });

  test("HexColorStrategy should parse and format colors with alpha color ", () => {
    const strategy = new HexColorStrategy();

    const parsedColorWithAlpha = strategy.parseColor("ffdd1212");
    assert.deepStrictEqual(parsedColorWithAlpha, {
      r: 255,
      g: 221,
      b: 18,
      o: 18,
    });

    const formattedColorWithoutAlpha = strategy.formatColor(
      new Color(0.1, 0.2, 0.3, 0.5)
    );
    assert.strictEqual(formattedColorWithoutAlpha, "#1A334D80");
  });

  suite("ARGB Stratergy", () => {
    test("ARGBColorStrategy should parse and format colors without alpha correctly", () => {
      const strategy = new ARGBColorStrategy();

      const parsedColorWithAlpha = strategy.parseColor("ffdd12");
      assert.deepStrictEqual(parsedColorWithAlpha, {
        r: 255,
        g: 221,
        b: 18,
        o: 255,
      });

      const formattedColorWithAlpha = strategy.formatColor(
        new Color(0.1, 0.2, 0.3, 1)
      );
      assert.strictEqual(formattedColorWithAlpha, "#1A334D");
    });

    test("ARGBColorStrategy should parse and format colors with alpha color ", () => {
      const strategy = new ARGBColorStrategy();

      const parsedColorWithAlpha = strategy.parseColor("ffdd1212");
      assert.deepStrictEqual(parsedColorWithAlpha, {
        r: 221,
        g: 18,
        b: 18,
        o: 255,
      });

      const formattedColorWithoutAlpha = strategy.formatColor(
        new Color(0.1, 0.2, 0.3, 0.5)
      );
      assert.strictEqual(formattedColorWithoutAlpha, "#801A334D");
    });
  });

  suite("FlutterColorStrategy", () => {
    const strategy = new FlutterColorStrategy();

    test("should parse and format colors with full opacity correctly", () => {
      // Test parsing
      const parsedColor = strategy.parseColor("0xFF123456");
      assert.deepStrictEqual(parsedColor, { r: 18, g: 52, b: 86, o: 255 });

      // Test formatting
      const formattedColor = strategy.formatColor(new Color(0.1, 0.2, 0.3, 1));
      assert.strictEqual(formattedColor, "0xFF1A334D");
    });

    test("should parse and format colors with partial opacity correctly", () => {
      // Test parsing
      const parsedColor = strategy.parseColor("0x80123456");
      assert.deepStrictEqual(parsedColor, { r: 18, g: 52, b: 86, o: 128 });

      // Test formatting
      const formattedColor = strategy.formatColor(
        new Color(0.1, 0.2, 0.3, 0.5)
      );
      assert.strictEqual(formattedColor, "0x801A334D");
    });

    test("should handle edge cases correctly", () => {
      // Fully transparent
      assert.strictEqual(
        strategy.formatColor(new Color(1, 1, 1, 0)),
        "0x00FFFFFF"
      );

      // Fully opaque black
      assert.strictEqual(
        strategy.formatColor(new Color(0, 0, 0, 1)),
        "0xFF000000"
      );

      // Fully opaque white
      assert.strictEqual(
        strategy.formatColor(new Color(1, 1, 1, 1)),
        "0xFFFFFFFF"
      );
    });
  });

  suite("HexColorStrategy Configuration Tests", () => {
    test("should format hex with lowercase when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });
      const strategy = new HexColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 0.5));
      assert.strictEqual(result, "#1a334d80");

      restoreWorkspaceConfiguration(stub);
    });

    test("should format hex with uppercase (default) when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });
      const strategy = new HexColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 0.5));
      assert.strictEqual(result, "#1A334D80");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle partial opacity with lowercase format", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });
      const strategy = new HexColorStrategy();

      const result = strategy.formatColor(new Color(1, 1, 1, 0));
      assert.strictEqual(result, "#ffffff00");

      restoreWorkspaceConfiguration(stub);
    });
  });

  suite("FlutterColorStrategy Configuration Tests", () => {
    test("should format flutter color with lowercase when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });
      const strategy = new FlutterColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 1));
      assert.strictEqual(result, "0xff1a334d");

      restoreWorkspaceConfiguration(stub);
    });

    test("should format flutter color with uppercase when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });
      const strategy = new FlutterColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 1));
      assert.strictEqual(result, "0xFF1A334D");

      restoreWorkspaceConfiguration(stub);
    });

    test("should include alpha when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });
      const strategy = new FlutterColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 0.5));
      assert.strictEqual(result, "0x801A334D");

      restoreWorkspaceConfiguration(stub);
    });
  });

  suite("ARGBColorStrategy Configuration Tests", () => {
    test("should format ARGB with lowercase when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });
      const strategy = new ARGBColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 0.5));
      assert.strictEqual(result, "#801a334d");

      restoreWorkspaceConfiguration(stub);
    });

    test("should format ARGB with uppercase when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });
      const strategy = new ARGBColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 0.5));
      assert.strictEqual(result, "#801A334D");

      restoreWorkspaceConfiguration(stub);
    });

    test("should include alpha when configured", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });
      const strategy = new ARGBColorStrategy();

      const result = strategy.formatColor(new Color(0.1, 0.2, 0.3, 0.5));
      assert.strictEqual(result, "#801A334D");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle partial opacity with lowercase format", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });
      const strategy = new ARGBColorStrategy();

      const result = strategy.formatColor(new Color(1, 1, 1, 0));
      assert.strictEqual(result, "#00ffffff");

      restoreWorkspaceConfiguration(stub);
    });
  });

  suite("RGBColorStrategy", () => {
    test("should parse rgb format with spaces correctly", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgb(255, 0, 0)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 255 });
    });

    test("should parse rgb format without spaces correctly", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgb(255,0,0)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 255 });
    });

    test("should parse rgba format with alpha correctly", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgba(255, 0, 0, 0.5)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 128 });
    });

    test("should parse rgba format with full opacity correctly", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgba(255, 0, 0, 1)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 255 });
    });

    test("should parse rgba format with zero opacity correctly", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgba(255, 0, 0, 0)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 0 });
    });

    test("should parse rgba format with decimal alpha without leading zero", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgba(255, 0, 0, .5)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 128 });
    });

    test("should clamp RGB values above 255", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgb(300, 0, 0)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 255 });
    });

    test("should clamp alpha values above 1", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgba(255, 0, 0, 1.5)");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 0, b: 0, o: 255 });
    });

    test("should format fully opaque colors as rgb()", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "spaced" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(1, 0, 0, 1));
      assert.strictEqual(result, "rgb(255, 0, 0)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should format transparent colors as rgba()", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "spaced" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(1, 0, 0, 0.5));
      assert.strictEqual(result, "rgba(255, 0, 0, 0.5)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should format colors with compact spacing", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "compact" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(1, 0, 0, 1));
      assert.strictEqual(result, "rgb(255,0,0)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should format colors with spaced spacing (default)", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "spaced" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(0.5, 0.5, 0.5, 1));
      assert.strictEqual(result, "rgb(128, 128, 128)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle edge case: fully transparent black", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "spaced" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(0, 0, 0, 0));
      assert.strictEqual(result, "rgba(0, 0, 0, 0)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle edge case: fully opaque white", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "spaced" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(1, 1, 1, 1));
      assert.strictEqual(result, "rgb(255, 255, 255)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should round alpha values to 2 decimal places", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "spaced" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(1, 0, 0, 0.333333));
      assert.strictEqual(result, "rgba(255, 0, 0, 0.33)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should remove trailing zeros from alpha", () => {
      const stub = mockWorkspaceConfiguration({ rgbSpacing: "spaced" });
      const strategy = new RGBColorStrategy();

      const result = strategy.formatColor(new Color(1, 0, 0, 0.5));
      assert.strictEqual(result, "rgba(255, 0, 0, 0.5)");

      restoreWorkspaceConfiguration(stub);
    });

    test("should parse mixed RGB values with different spacing", () => {
      const strategy = new RGBColorStrategy();

      const parsedColor = strategy.parseColor("rgb( 255 , 128 , 64 )");
      assert.deepStrictEqual(parsedColor, { r: 255, g: 128, b: 64, o: 255 });
    });
  });
});

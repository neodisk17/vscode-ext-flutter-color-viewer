import * as assert from "assert";
import { Color } from "vscode";
import HexColorStrategy from "../colorStratergy/hexColorStratergy";
import FlutterColorStrategy from "../colorStratergy/flutterColorStratergy";
import ARGBColorStrategy from "../colorStratergy/argbColorStratergy";

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
        new Color(0.1, 0.2, 0.3, 0)
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
});

import * as assert from "assert";
import formatHexString from "../utils/formatHexString";
import {
  mockWorkspaceConfiguration,
  restoreWorkspaceConfiguration,
} from "./configTestUtils";

suite("formatHexString Test Suite", () => {
  suite("hexFormat setting - Uppercase", () => {
    test("should convert to uppercase when hexFormat is 'upper case'", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });

      const result = formatHexString("ff1a334d");
      assert.strictEqual(result, "FF1A334D");

      restoreWorkspaceConfiguration(stub);
    });

    test("should keep uppercase when already in uppercase", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });

      const result = formatHexString("FF1A334D");
      assert.strictEqual(result, "FF1A334D");

      restoreWorkspaceConfiguration(stub);
    });
  });

  suite("hexFormat setting - Lowercase", () => {
    test("should convert to lowercase when hexFormat is 'lower case'", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });

      const result = formatHexString("FF1A334D");
      assert.strictEqual(result, "ff1a334d");

      restoreWorkspaceConfiguration(stub);
    });

    test("should keep lowercase when already in lowercase", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });

      const result = formatHexString("ff1a334d");
      assert.strictEqual(result, "ff1a334d");

      restoreWorkspaceConfiguration(stub);
    });
  });

  suite("includeAlpha setting", () => {
    test("should include full 8-character hex when includeAlpha is true", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });

      const result = formatHexString("FF1A334D");
      assert.strictEqual(result, "FF1A334D");
      assert.strictEqual(result.length, 8);

      restoreWorkspaceConfiguration(stub);
    });

    test("should truncate to 6 characters when includeAlpha is false", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: false,
      });

      const result = formatHexString("FF1A334D");
      assert.strictEqual(result, "FF1A33");
      assert.strictEqual(result.length, 6);

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle 6-character input when includeAlpha is false", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: false,
      });

      const result = formatHexString("1A334D");
      assert.strictEqual(result, "1A334D");
      assert.strictEqual(result.length, 6);

      restoreWorkspaceConfiguration(stub);
    });
  });

  suite("Combined settings", () => {
    test("should apply both lowercase and alpha exclusion", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: false,
      });

      const result = formatHexString("FF1A334D");
      assert.strictEqual(result, "ff1a33");

      restoreWorkspaceConfiguration(stub);
    });

    test("should apply both uppercase and alpha inclusion", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });

      const result = formatHexString("ff1a334d");
      assert.strictEqual(result, "FF1A334D");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle uppercase with alpha exclusion", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: false,
      });

      const result = formatHexString("ff1a334d");
      assert.strictEqual(result, "FF1A33");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle lowercase with alpha inclusion", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "lower case",
        includeAlpha: true,
      });

      const result = formatHexString("FF1A334D");
      assert.strictEqual(result, "ff1a334d");

      restoreWorkspaceConfiguration(stub);
    });
  });

  suite("Edge cases", () => {
    test("should handle semi-transparent alpha values", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });

      const result = formatHexString("1A334D80");
      assert.strictEqual(result, "1A334D80");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle full transparency", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });

      const result = formatHexString("1A334D00");
      assert.strictEqual(result, "1A334D00");

      restoreWorkspaceConfiguration(stub);
    });

    test("should handle full opacity", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: true,
      });

      const result = formatHexString("1A334DFF");
      assert.strictEqual(result, "1A334DFF");

      restoreWorkspaceConfiguration(stub);
    });

    test("should exclude alpha from full opacity hex when includeAlpha is false", () => {
      const stub = mockWorkspaceConfiguration({
        hexFormat: "upper case",
        includeAlpha: false,
      });

      const result = formatHexString("1A334DFF");
      assert.strictEqual(result, "1A334D");

      restoreWorkspaceConfiguration(stub);
    });
  });
});

import * as assert from "assert";
import * as vscode from "vscode";
import * as myExtension from "../extension";

interface MockExtensionContext {
  subscriptions: unknown[];
  globalState: {
    get: () => unknown;
    update: () => void;
  };
}

const context: MockExtensionContext = {
  subscriptions: [],
  globalState: {
    get: () => {},
    update: () => {},
  },
};

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present", () => {
    assert.ok(
      vscode.extensions.getExtension("circlecodesolution.ccs-flutter-color")
    );
  });

  test("Activation function should register color provider", async () => {
    await myExtension.activate(context);

    assert.strictEqual(context.subscriptions.length, 1);
  });
});

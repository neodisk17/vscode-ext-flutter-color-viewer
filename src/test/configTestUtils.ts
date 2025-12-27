import * as sinon from "sinon";
import * as vscode from "vscode";

let currentSandbox: sinon.SinonSandbox | null = null;

/**
 * Configuration options for mocking workspace settings
 */
export interface ConfigMockOptions {
  hexFormat?: "lower case" | "upper case";
  includeAlpha?: boolean;
  enableRgbSupport?: boolean;
  rgbSpacing?: "compact" | "spaced";
}

/**
 * Mocks VS Code workspace configuration for testing
 * @param options Configuration options to mock
 * @returns Sinon sandbox that should be restored after the test
 */
export function mockWorkspaceConfiguration(
  options: ConfigMockOptions
): sinon.SinonSandbox {
  // Restore previous sandbox if it exists
  if (currentSandbox) {
    currentSandbox.restore();
  }

  const sandbox = sinon.createSandbox();
  currentSandbox = sandbox;

  const getConfigStub = sandbox.stub().callsFake((key?: string) => {
    if (key === "flutterColor.hexFormat") {
      return options.hexFormat ?? "upper case";
    }
    if (key === "flutterColor.includeAlpha") {
      return options.includeAlpha !== undefined ? options.includeAlpha : true;
    }
    if (key === "flutterColor.enableRgbSupport") {
      return options.enableRgbSupport !== undefined ? options.enableRgbSupport : true;
    }
    if (key === "flutterColor.rgbSpacing") {
      return options.rgbSpacing ?? "spaced";
    }
    return undefined;
  });

  sandbox.stub(vscode.workspace, "getConfiguration").returns({
    get: getConfigStub,
  } as any);

  return sandbox;
}

/**
 * Restores the workspace configuration mock
 * @param sandbox Sinon sandbox returned from mockWorkspaceConfiguration
 */
export function restoreWorkspaceConfiguration(sandbox: sinon.SinonSandbox): void {
  sandbox.restore();
  if (currentSandbox === sandbox) {
    currentSandbox = null;
  }
}

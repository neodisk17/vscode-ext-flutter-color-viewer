// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FlutterColorShow from "./FlutterColorShow";
import JSONColorShow from "./JSONColorShow";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	let docFlutterSelector = {
		pattern: "**/*.dart"
	};

	// Register our CodeLens provider
	let FlutterColorShowDisposable = vscode.languages.registerColorProvider(
		docFlutterSelector,
		new FlutterColorShow()
	);

	let docJsonSelector = {
		pattern: "**/*.json",
	};

	// Register our CodeLens provider
	let JSONColorShowDisposable = vscode.languages.registerColorProvider(
		docJsonSelector,
		new JSONColorShow()
	);

	context.subscriptions.push(FlutterColorShowDisposable);
	context.subscriptions.push(JSONColorShowDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

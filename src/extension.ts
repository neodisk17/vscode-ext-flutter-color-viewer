// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FlutterColorShow from "./FlutterColorShow";
import AllColorShow from "./AllColorShow";
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

	let allFileSelector = {
		pattern: "**/*",
	};

	// Register our CodeLens provider
	let AllColorShowDisposable = vscode.languages.registerColorProvider(
		allFileSelector,
		new AllColorShow()
	);

	context.subscriptions.push(FlutterColorShowDisposable);
	context.subscriptions.push(AllColorShowDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

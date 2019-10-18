// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FlutterColorShow from "./FlutterColorShow";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	let docSelector = {
		pattern: "**/*.dart"
	  };
	
	// Register our CodeLens provider
	let FlutterColorShowDisposable = vscode.languages.registerColorProvider(
		docSelector,
		new FlutterColorShow()
	);

	context.subscriptions.push(FlutterColorShowDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

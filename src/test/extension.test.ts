import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('circlecodesolution.ccs-flutter-color'));
    });

    test('Activation function should register color provider', async () => {
        const context = {
            subscriptions: [],
            globalState: {
                get: () => {},
                update: () => {}
            }
        } as any;

        await myExtension.activate(context);

        assert.strictEqual(context.subscriptions.length, 1);
    });
});

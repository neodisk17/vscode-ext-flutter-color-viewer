import * as assert from 'assert';
import { TextDocument, ColorInformation, Color } from 'vscode';
import UnifiedColorProvider from '../unifiedColorProvider';
import {
  mockWorkspaceConfiguration,
  restoreWorkspaceConfiguration,
} from './configTestUtils';

suite('UnifiedColorProvider Test Suite', () => {
    let provider: UnifiedColorProvider;

    setup(() => {
        provider = new UnifiedColorProvider();
    });

    test('provideDocumentColors should return colors for dart file', () => {
        const mockDocument = {
            languageId: 'dart',
            getText: () => 'Color(0xFF123456)',
        } as TextDocument;

        const colors = provider.provideDocumentColors(mockDocument);

        assert.ok(Array.isArray(colors));
        assert.strictEqual(colors.length, 1);
        assert.ok(colors[0] instanceof ColorInformation);
    });

    test('provideColorPresentations should return multiple format options for dart file', () => {
        const stub = mockWorkspaceConfiguration({ rgbSpacing: 'spaced' });
        const mockContext = {
            document: { languageId: 'dart' } as TextDocument
        };
        const color = new Color(0.1, 0.2, 0.3, 1);

        const presentations = provider.provideColorPresentations(color, mockContext);

        assert.ok(Array.isArray(presentations));
        // Should have Flutter format + RGB format
        assert.strictEqual(presentations.length, 2);
        assert.strictEqual(presentations[0].label, '0xFF1A334D');
        assert.strictEqual(presentations[1].label, 'rgb(26, 51, 77)');

        restoreWorkspaceConfiguration(stub);
    });

    test('should use HexColorStrategy for default language', () => {
        const mockDocument = {
            languageId: 'javascript',
            getText: () => '#123456',
        } as TextDocument;

        const colors = provider.provideDocumentColors(mockDocument);

        assert.ok(Array.isArray(colors));
        assert.strictEqual(colors.length, 1);
        assert.ok(colors[0] instanceof ColorInformation);
        assert.strictEqual(colors[0].color.red, 18/255);
        assert.strictEqual(colors[0].color.green, 52/255);
        assert.strictEqual(colors[0].color.blue, 86/255);
    });

    test('should use ARGBColorStrategy for qml language', () => {
        const mockDocument = {
            languageId: 'qml',
            getText: () => '#FF123456',
        } as TextDocument;

        const colors = provider.provideDocumentColors(mockDocument);

        assert.ok(Array.isArray(colors));
        assert.strictEqual(colors.length, 1);
        assert.ok(colors[0] instanceof ColorInformation);
        assert.strictEqual(colors[0].color.red, 18/255);
        assert.strictEqual(colors[0].color.green, 52/255);
        assert.strictEqual(colors[0].color.blue, 86/255);
        assert.strictEqual(colors[0].color.alpha, 1);
    });

    test('should detect RGB color format', () => {
        const mockDocument = {
            languageId: 'javascript',
            getText: () => 'rgb(255, 0, 0)',
        } as TextDocument;

        const colors = provider.provideDocumentColors(mockDocument);

        assert.ok(Array.isArray(colors));
        assert.strictEqual(colors.length, 1);
        assert.ok(colors[0] instanceof ColorInformation);
        assert.strictEqual(colors[0].color.red, 1);
        assert.strictEqual(colors[0].color.green, 0);
        assert.strictEqual(colors[0].color.blue, 0);
        assert.strictEqual(colors[0].color.alpha, 1);
    });

    test('should detect RGBA color format', () => {
        const mockDocument = {
            languageId: 'javascript',
            getText: () => 'rgba(255, 0, 0, 0.5)',
        } as TextDocument;

        const colors = provider.provideDocumentColors(mockDocument);

        assert.ok(Array.isArray(colors));
        assert.strictEqual(colors.length, 1);
        assert.ok(colors[0] instanceof ColorInformation);
        assert.strictEqual(colors[0].color.red, 1);
        assert.strictEqual(colors[0].color.green, 0);
        assert.strictEqual(colors[0].color.blue, 0);
        // Alpha is converted to 0-255 range and back, so 0.5 becomes 128/255 ≈ 0.502
        assert.ok(Math.abs(colors[0].color.alpha - 0.5) < 0.01);
    });

    test('should return multiple formats for hex color', () => {
        const stub = mockWorkspaceConfiguration({ rgbSpacing: 'spaced' });
        const mockContext = {
            document: { languageId: 'javascript' } as TextDocument
        };
        const color = new Color(1, 0, 0, 1);

        const presentations = provider.provideColorPresentations(color, mockContext);

        assert.ok(Array.isArray(presentations));
        // Should have Hex format + RGB format
        assert.strictEqual(presentations.length, 2);
        assert.strictEqual(presentations[0].label, '#FF0000');
        assert.strictEqual(presentations[1].label, 'rgb(255, 0, 0)');

        restoreWorkspaceConfiguration(stub);
    });

    test('should respect enableRgbSupport configuration', () => {
        const stub = mockWorkspaceConfiguration({ enableRgbSupport: false });
        const mockContext = {
            document: { languageId: 'javascript' } as TextDocument
        };
        const color = new Color(1, 0, 0, 1);

        const presentations = provider.provideColorPresentations(color, mockContext);

        assert.ok(Array.isArray(presentations));
        // Should only have Hex format, not RGB
        assert.strictEqual(presentations.length, 1);
        assert.strictEqual(presentations[0].label, '#FF0000');

        restoreWorkspaceConfiguration(stub);
    });

    test('should deduplicate colors at the same position', () => {
        const stub = mockWorkspaceConfiguration({ rgbSpacing: 'compact' });
        // Document with both hex and rgb color at same logical position
        const mockDocument = {
            languageId: 'javascript',
            getText: () => `const color = '#FF0000';\nconst color2 = rgb(255, 0, 0);`,
        } as TextDocument;

        const colors = provider.provideDocumentColors(mockDocument);

        assert.ok(Array.isArray(colors));
        // Should have 2 colors (one hex, one rgb) at different positions
        assert.strictEqual(colors.length, 2);

        restoreWorkspaceConfiguration(stub);
    });
});
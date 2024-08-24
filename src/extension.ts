import { ExtensionContext, extensions, languages } from 'vscode';
import UnifiedColorProvider from "./unifiedColorProvider";
import { EXTENSION_ID } from './constant';
import { activateTracking, sendTrackingEvent } from './tracking';
import { TelemetryEnum } from './enum/telemetry.enum';
import { TelemetryTypeEnum } from './enum/telemetryType.enum';

const checkForUpgrade = (context: ExtensionContext) => {
    const extension = extensions.getExtension(EXTENSION_ID);
    const currentVersion = extension!.packageJSON.version;
    const previousVersion = context.globalState.get('extensionVersion');

    if (previousVersion && previousVersion !== currentVersion) {
        sendTrackingEvent(TelemetryEnum.update, {
            previousVersion,
            currentVersion
        }, TelemetryTypeEnum.base);
    }

    context.globalState.update('extensionVersion', currentVersion);
};

export function activate(context: ExtensionContext) {
    activateTracking();

    checkForUpgrade(context);

    const colorProvider = new UnifiedColorProvider();

    let disposable = languages.registerColorProvider(
        { pattern: "**/*" },
        colorProvider
    );

    context.subscriptions.push(disposable);
    sendTrackingEvent(TelemetryEnum.install, {}, TelemetryTypeEnum.base);
}

export function deactivate() {
    sendTrackingEvent(TelemetryEnum.deactivate, {}, TelemetryTypeEnum.base);
}
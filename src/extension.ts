import { ExtensionContext, extensions, languages, env } from 'vscode';
import FlutterColorShow from "./FlutterColorShow";
import AllColorShow from "./AllColorShow";
import { EXTENSION_ID } from './constant';
import { activateTracking, sendTrackingEvent } from './tracking';
import { TelemetryEnum } from './enum/telemetry.enum';
import { TelemetryTypeEnum } from './enum/telemetryType.enum';


const checkForUpgrade = (context: ExtensionContext) => {
	const extension = extensions.getExtension(EXTENSION_ID);
	const currentVersion = extension!.packageJSON.version;

	// Retrieve the previous version from global state
	const previousVersion = context.globalState.get('extensionVersion');

	// Compare the versions
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

	let docFlutterSelector = {
		pattern: "**/*.dart"
	};

	let FlutterColorShowDisposable = languages.registerColorProvider(
		docFlutterSelector,
		new FlutterColorShow()
	);

	let allFileSelector = {
		pattern: "**/*",
	};

	let AllColorShowDisposable = languages.registerColorProvider(
		allFileSelector,
		new AllColorShow()
	);
	context.subscriptions.push(FlutterColorShowDisposable);
	context.subscriptions.push(AllColorShowDisposable);
	sendTrackingEvent(TelemetryEnum.install, {}, TelemetryTypeEnum.base);
}

export function deactivate() {
	sendTrackingEvent(TelemetryEnum.deactivate, {}, TelemetryTypeEnum.base);
}

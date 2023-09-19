import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";
import { sendTrackingEvent } from "./tracking";

console.log("Plugin uninstalled");
sendTrackingEvent(TelemetryEnum.deactivate, {}, TelemetryTypeEnum.base);
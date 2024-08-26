import { env } from "vscode";
import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";

export const activateTracking = async () => {
  const { isTelemetryEnabled } = env;

  if (!isTelemetryEnabled) {
    return;
  }

  try {
    // await fetch(`${PROXY_URL}/intro`, {
    //   method: 'post',
    //   body: JSON.stringify({
    //     ...baseDetails,
    //     machine_id: machineId
    //   }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  } catch (error) {
    console.log("Error is ", error);
  }
};

export const sendTrackingEvent = async (
  _trackingEvent: TelemetryEnum,
  _data: Record<string, unknown>,
  _telemetryType?: TelemetryTypeEnum
) => {
  const { isTelemetryEnabled } = env;

  if (!isTelemetryEnabled) {
    return;
  }

  console.log("_trackingEvent ", _trackingEvent);
  console.log("_data ", _data);
  console.log("_telemetryType ", _telemetryType);

  try {
    // await fetch(PROXY_URL, {
    //     method: 'post',
    //     body: JSON.stringify(trackingData),
    //     headers: { 'Content-Type': 'application/json' }
    // });
  } catch (error) {
    console.log("Error is ", error);
  }
};

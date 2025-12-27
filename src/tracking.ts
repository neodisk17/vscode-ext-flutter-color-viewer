import convertCamelToSnakeCase from "./utils/convertCamelToSnakeCase";
import getBaseTelemetryDetails from "./utils/getBaseTelemetryDetails";
import getEditorTelemetryDetails from "./utils/getEditorTelemetryDetails";

import { env } from 'vscode';
import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";
import { TRACKING_ID } from "./constant";

const mixpanel = require('mixpanel');

const mp = mixpanel.init(TRACKING_ID, { debug: true });

export const activateTracking = async () => {
  const { machineId, isTelemetryEnabled } = env;

  if (!isTelemetryEnabled) {return;}

  let baseDetails = getBaseTelemetryDetails();
  baseDetails = convertCamelToSnakeCase(baseDetails);

  try {
    mp.people.set(machineId, baseDetails);
  } catch (error) {
    console.error("Error in activateTracking: ", error);
  }
};

export const sendTrackingEvent = async (trackingEvent: TelemetryEnum, data: any, telemetryType?: TelemetryTypeEnum) => {
    const { machineId, isTelemetryEnabled } = env;

    if (!isTelemetryEnabled) {return;}

    const getAdditionalDetails = () => {
        switch (telemetryType) {
            case TelemetryTypeEnum.base:
                return getBaseTelemetryDetails();
            case TelemetryTypeEnum.editor:
                return getEditorTelemetryDetails();
            case TelemetryTypeEnum.both:
                return { ...getBaseTelemetryDetails(), ...getEditorTelemetryDetails() };
            default:
                return {};
        }
    };

    const trackingData = convertCamelToSnakeCase({
        ...data,
        ...getAdditionalDetails(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "distinct_id": machineId,
    });

    try {
        mp.track(trackingEvent,trackingData);
      
    } catch (error) {
        console.error("Error is ", error);
    }
};
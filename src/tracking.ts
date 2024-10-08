import convertCamelToSnakeCase from "./utils/convertCamelToSnakeCase";
import getBaseTelemetryDetails from "./utils/getBaseTelemetryDetails";
import getEditorTelemetryDetails from "./utils/getEditorTelemetryDetails";
// import fetch from 'node-fetch';

import { env } from 'vscode';
import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";
import { PROXY_URL } from "./constant";

export const activateTracking = async () => {
  const { machineId, isTelemetryEnabled } = env;

  if (!isTelemetryEnabled) {return;}

  let baseDetails = getBaseTelemetryDetails();

  baseDetails = convertCamelToSnakeCase(baseDetails);

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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "tracking_event": trackingEvent,
    });

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
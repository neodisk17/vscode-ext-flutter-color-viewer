import convertCamelToSnakeCase from "./utils/convertCamelToSnakeCase";
import getBaseTelemetryDetails from "./utils/getBaseTelemetryDetails";
import getEditorTelemetryDetails from "./utils/getEditorTelemetryDetails";
import fetch from 'node-fetch';

import { env } from 'vscode';
import { TelemetryEnum } from "./enum/telemetry.enum";
import { TelemetryTypeEnum } from "./enum/telemetryType.enum";
import { PROXY_URL } from "./constant";

export const activateTracking = async () => {
  const { machineId, isTelemetryEnabled } = env;

  if (!isTelemetryEnabled) return

  let baseDetails = getBaseTelemetryDetails();

  baseDetails = convertCamelToSnakeCase(baseDetails);

  try {
    await fetch(`${PROXY_URL}/intro`, {
      method: 'post',
      body: JSON.stringify({
        ...baseDetails,
        machine_id: machineId
      }),
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.log("Error is ", error)
  }

};

export const sendTrackingEvent = async (trackingEvent: TelemetryEnum, data: any, telemetryType?: TelemetryTypeEnum) => {
  const { machineId, isTelemetryEnabled } = env;

  if (!isTelemetryEnabled) return

  let trackingData = {
    ...data
  };
  let additionalDetails = {};

  switch (telemetryType) {

    case TelemetryTypeEnum.base:
      additionalDetails = getBaseTelemetryDetails();
      trackingData = {
        ...trackingData,
        ...additionalDetails
      };
      break;

    case TelemetryTypeEnum.editor:
      additionalDetails = getEditorTelemetryDetails();
      trackingData = {
        ...trackingData,
        ...additionalDetails
      };
      break;

    case TelemetryTypeEnum.both:
      additionalDetails = getBaseTelemetryDetails();
      const editorDetails = getEditorTelemetryDetails();
      trackingData = {
        ...trackingData,
        ...additionalDetails,
        ...editorDetails
      };
      break;
  }

  trackingData = convertCamelToSnakeCase(trackingData);

  try {

    await fetch(`${PROXY_URL}`, {
      method: 'post',
      body: JSON.stringify({
        ...trackingData,
        distinct_id: machineId,
        tracking_event: trackingEvent,
      }),
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.log("Error is ", error);
  }
};
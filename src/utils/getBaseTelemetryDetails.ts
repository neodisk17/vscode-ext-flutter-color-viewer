import { EXTENSION_ID } from "../constant";
import { env, version, extensions } from 'vscode';
import {platform, release} from 'os';

const extension = extensions.getExtension(EXTENSION_ID);
const operatingSystem = platform();
const osVersion = release();
const userLanguage = env.language;
const machineId = env.machineId;

const getBaseTelemetryDetails = () => {

    const pluginVersion = extension!.packageJSON.version;
    const appName = env.appName;
    const appHost = env.appHost;
    const vsCodeVersion = version;

    return {
        operatingSystem,
        osVersion,
        userLanguage,
        vsCodeVersion,
        pluginVersion,
        appName,
        appHost,
        machineId
    };

};

export default getBaseTelemetryDetails;
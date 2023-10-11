// Test case 1: Get telemetry details for a valid extension.
const mockExtension = {
    packageJSON: {
        version: "1.0.0",
    },
};
const mockEnv = {
    appName: "Visual Studio Code",
    appHost: "linux",
    language: "en",
    machineId: "1234567890",
};
const mockVersion = "1.75.0";
const mockPlatform = "linux";
const mockRelease = "5.15.0";

const expectedTelemetryDetails = {
    operatingSystem: "linux",
    osVersion: "5.15.0",
    userLanguage: "en",
    vsCodeVersion: "1.75.0",
    pluginVersion: "1.0.0",
    appName: "Visual Studio Code",
    appHost: "linux",
    machineId: "1234567890",
};

const actualTelemetryDetails = getBaseTelemetryDetails(mockExtension, mockEnv, mockVersion, mockPlatform, mockRelease);

expect(actualTelemetryDetails).toEqual(expectedTelemetryDetails);

// Test case 2: Get telemetry details for an extension with no packageJSON.
const mockExtensionWithoutPackageJSON = {};

const expectedTelemetryDetailsWithoutPackageJSON = {
    operatingSystem: "linux",
    osVersion: "5.15.0",
    userLanguage: "en",
    vsCodeVersion: "1.75.0",
    pluginVersion: "unknown",
    appName: "Visual Studio Code",
    appHost: "linux",
    machineId: "1234567890",
};

const actualTelemetryDetailsWithoutPackageJSON = getBaseTelemetryDetails(mockExtensionWithoutPackageJSON, mockEnv, mockVersion, mockPlatform, mockRelease);

expect(actualTelemetryDetailsWithoutPackageJSON).toEqual(expectedTelemetryDetailsWithoutPackageJSON);

// Test case 3: Get telemetry details for an extension with an invalid packageJSON version.
const mockExtensionWithInvalidPackageJSON = {
    packageJSON: {
        version: "invalid-version",
    },
};

const expectedTelemetryDetailsWithInvalidPackageJSONVersion = {
    operatingSystem: "linux",
    osVersion: "5.15.0",
    userLanguage: "en",
    vsCodeVersion: "1.75.0",
    pluginVersion: "unknown",
    appName: "Visual Studio Code",
    appHost: "linux",
    machineId: "1234567890",
};

const actualTelemetryDetailsWithInvalidPackageJSONVersion = getBaseTelemetryDetails(mockExtensionWithInvalidPackageJSON, mockEnv, mockVersion, mockPlatform, mockRelease);

expect(actualTelemetryDetailsWithInvalidPackageJSONVersion).toEqual(expectedTelemetryDetailsWithInvalidPackageJSONVersion);

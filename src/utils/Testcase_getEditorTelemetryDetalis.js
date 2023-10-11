// Test case 1: Get telemetry details for an active text editor.
const mockActiveTextEditor = {
    document: {
        languageId: "javascript",
    },
};
const mockEnv = {
    machineId: "1234567890",
    sessionId: "abc123",
};

const expectedTelemetryDetails = {
    editorType: "javascript",
    machineId: "1234567890",
    sessionId: "abc123",
};

const actualTelemetryDetails = getEditorTelemetryDetails(mockActiveTextEditor, mockEnv);

expect(actualTelemetryDetails).toEqual(expectedTelemetryDetails);

// Test case 2: Get telemetry details for no active text editor.
const mockEnvWithoutActiveTextEditor = {
    machineId: "1234567890",
    sessionId: "abc123",
};

const expectedTelemetryDetailsWithoutActiveTextEditor = {
    editorType: "unknown",
    machineId: "1234567890",
    sessionId: "abc123",
};

const actualTelemetryDetailsWithoutActiveTextEditor = getEditorTelemetryDetails(null, mockEnvWithoutActiveTextEditor);

expect(actualTelemetryDetailsWithoutActiveTextEditor).toEqual(expectedTelemetryDetailsWithoutActiveTextEditor);

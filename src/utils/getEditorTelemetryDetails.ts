import { env, window } from 'vscode';

const getEditorTelemetryDetails = () => {
    
    const activeTextEditor = window.activeTextEditor;
    const { machineId, sessionId } = env;
    let editorType = 'unknown';

    if (activeTextEditor) {
        editorType = activeTextEditor.document.languageId;
    }

    return {
        editorType,
        machineId,
        sessionId
    };
};

export default getEditorTelemetryDetails;
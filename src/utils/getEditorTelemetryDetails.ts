import { env, window } from "vscode";

const getEditorTelemetryDetails = () => {
  const { machineId, sessionId } = env;
  const editorType = window.activeTextEditor?.document.languageId ?? "unknown";

  return { editorType, machineId, sessionId };
};

export default getEditorTelemetryDetails;

import { workspace } from "vscode";

const formatHexString = (hexString: string): string => {
  const config = workspace.getConfiguration();
  const baseReturnValue = config.get("flutterColor.includeAlpha")
    ? hexString
    : hexString.substring(0, 6);
  if (config.get("flutterColor.hexFormat") === "upper case") {
    return baseReturnValue.toUpperCase();
  }
  return baseReturnValue.toLowerCase();
};

export default formatHexString;

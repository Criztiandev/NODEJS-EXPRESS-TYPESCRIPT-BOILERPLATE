import path from "path";

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getFeaturePaths = (moduleName: string, BASE_DIR: string) => ({
  INTERFACE_DIR: path.join(BASE_DIR, "feature", moduleName, "interface"),
  VALIDATION_DIR: path.join(BASE_DIR, "feature", moduleName, "validation"),
});

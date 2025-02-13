export const typeMapping = {
  String: "string",
  Number: "number",
  Date: "Date",
  Boolean: "boolean",
  ObjectID: "string",
  Array: "any[]",
  Mixed: "any",
  Map: "Record<string, any>",
} as const;

export const typeMapping = {
  mongoose: {
    [String.name]: "String",
    [Number.name]: "Number",
    [Boolean.name]: "Boolean",
    [Date.name]: "Date",
    [Object.name]: "Object",
    [Array.name]: "Array",
  },
  typescript: {
    [String.name]: "string",
    [Number.name]: "number",
    [Boolean.name]: "boolean",
    [Date.name]: "Date",
    [Object.name]: "object",
    [Array.name]: "any[]",
  },
  zod: {
    [String.name]: "string()",
    [Number.name]: "number()",
    [Boolean.name]: "boolean()",
    [Date.name]: "date()",
    [Object.name]: "object()",
    [Array.name]: "array()",
  },
} as const;

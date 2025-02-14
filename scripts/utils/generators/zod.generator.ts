import { capitalize } from "../helpers/other.helper";
import { typeMapping } from "../helpers/typemapping.helper";
import { Schema } from "../helpers/types.helper";

// Common validation patterns
// if there is optional field, it should be .optional() and at the end of the line
const commonValidations = {
  email: (baseType: string) =>
    `${baseType}.email({ message: "Invalid email address" })` +
    `.min(5, { message: "Email must be at least 5 characters" })` +
    `.max(255, { message: "Email must be at most 255 characters" })`,

  password: (baseType: string) =>
    `${baseType}.min(8, { message: "Password must be at least 8 characters" })` +
    `.max(100, { message: "Password must be at most 100 characters" })` +
    `.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$/, { ` +
    `message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })`,

  username: (baseType: string) =>
    `${baseType}.min(3, { message: "Username must be at least 3 characters" })` +
    `.max(30, { message: "Username must be at most 30 characters" })` +
    `.regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens" })`,

  url: (baseType: string) =>
    `${baseType}.url({ message: "Invalid URL format" })` +
    `.max(2083, { message: "URL is too long" })`,

  phone: (baseType: string) =>
    `${baseType}.regex(/^\\+?[1-9]\\d{1,14}$/, { message: "Invalid phone number format. Please use E.164 format" })`,

  date: (baseType: string) =>
    `${baseType}.refine((date) => !isNaN(new Date(date).getTime()), { message: "Invalid date format" })`,
};

export const generateZodValidation = (
  modelName: string,
  schema: Schema
): string => {
  const capitalizedName = capitalize(modelName);

  return `import { z } from "zod";

export const ${capitalizedName}Schema = z.object({
${Object.entries(schema)
  .map(([key, value]) => {
    const type = value.type.name;
    const zodType = `z.${typeMapping.zod[type]}`;
    const baseType = value.required ? zodType : `${zodType}.optional()`;

    // Apply common validations based on field name or type
    if (key.toLowerCase().includes("email")) {
      return `  ${key}: ${commonValidations.email(baseType)}`;
    }
    if (key.toLowerCase().includes("password")) {
      return `  ${key}: ${commonValidations.password(baseType)}`;
    }
    if (key.toLowerCase().includes("username")) {
      return `  ${key}: ${commonValidations.username(baseType)}`;
    }
    if (
      key.toLowerCase().includes("url") ||
      key.toLowerCase().includes("website")
    ) {
      return `  ${key}: ${commonValidations.url(baseType)}`;
    }
    if (key.toLowerCase().includes("phone")) {
      return `  ${key}: ${commonValidations.phone(baseType)}`;
    }
    if (type === "Date" || key.toLowerCase().includes("date")) {
      return `  ${key}: ${commonValidations.date(baseType)}`;
    }
    if (type === "String") {
      return `  ${key}: ${baseType}.min(1, { message: "${key} must be at least 1 character" }).max(155, { message: "${key} must be at most 155 characters" })`;
    }

    return `  ${key}: ${baseType}`;
  })
  .join(",\n")}
});

export type ${capitalizedName}Input = z.infer<typeof ${capitalizedName}Schema>;
`;
};

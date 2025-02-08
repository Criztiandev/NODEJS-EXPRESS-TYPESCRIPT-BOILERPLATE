import { capitalize } from "../helpers/other.helper";
import { typeMapping } from "../helpers/typemapping.helper";
import { Schema } from "../helpers/types.helper";

export const generateInterface = (
  modelName: string,
  schema: Schema
): string => {
  const capitalizedName = capitalize(modelName);

  return `
  import { ObjectId } from "mongoose";

  export interface ${capitalizedName} {
  _id?: ObjectId | string;
${Object.entries(schema)
  .map(([key, value]) => {
    const type = value.type.name;
    return `  ${key}${value.required ? "" : "?"}: ${
      typeMapping.typescript[type]
    };`;
  })
  .join("\n")}
}`;
};

import { capitalize } from "../helpers/other.helper";
import { typeMapping } from "../helpers/typemapping.helper";
import { Schema } from "../helpers/types.helper";

export const generateInterface = (
  modelName: string,
  schema: Schema
): string => {
  const capitalizedName = capitalize(modelName);

  // Identation they are not aligned

  return `import { Document, ObjectId } from "mongoose";
  import { SoftDeleteFields } from "../../../core/base/repository/base.repository";
  
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
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ${capitalizedName}Document extends Omit<${capitalizedName}, "_id">, Document, SoftDeleteFields {}
`;
};

import { capitalize } from "../helpers/other.helper";
import { typeMapping } from "../helpers/typemapping.helper";
import { Schema } from "../helpers/types.helper";

export const generateMongooseModel = (
  modelName: string,
  schema: Schema
): string => {
  const capitalizedName = capitalize(modelName);

  return `import { Schema, model, Query } from "mongoose";
import { ${capitalizedName}, ${capitalizedName}Document } from "../feature/${modelName}/interface/${modelName}.interface";

const ${modelName}Schema = new Schema(
  {
${Object.entries(schema)
  .map(([key, value]) => {
    const type = value.type.name;
    return `    ${key}: {
      type: ${typeMapping.mongoose[type]},
      required: ${value.required}
    }`;
  })
  .join(",\n")},
    isDeleted: { 
      type: Boolean, 
      required: true,
      default: false 
    },
    deletedAt: { 
      type: Date, 
      required: false,
      default: null 
    }
  },
  { 
    timestamps: true,
  }
);

// Middleware to exclude deleted documents by default
${modelName}Schema.pre(/^find/, function (this: Query<any, ${capitalizedName}Document>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default model<${capitalizedName}Document>("${capitalizedName}", ${modelName}Schema);
`;
};

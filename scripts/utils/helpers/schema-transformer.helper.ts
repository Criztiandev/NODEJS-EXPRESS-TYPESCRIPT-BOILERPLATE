// schema.transformer.ts
import { Schema as MongooseSchema } from "mongoose";
import { Schema } from "./types.helper";

export function transformMongooseSchema(
  mongooseSchema: MongooseSchema
): Schema {
  const paths = mongooseSchema.paths;
  const transformedSchema: Schema = {};

  Object.entries(paths).forEach(([key, schemaType]) => {
    // Skip mongoose internal fields
    if (key === "__v" || key === "_id") return;

    // Extract the type information
    const type = schemaType.instance;
    const required = schemaType.isRequired || false;

    transformedSchema[key] = {
      type: { name: type } as any,
      required,
    };
  });

  return transformedSchema;
}

// Update the main generator to use this transformer
export function transformSchemaInput(input: MongooseSchema): Schema {
  // If it's already a Mongoose Schema instance
  if (input instanceof MongooseSchema) {
    return transformMongooseSchema(input);
  }

  // If it's a plain object schema definition
  const tempSchema = new MongooseSchema(input);
  return transformMongooseSchema(tempSchema);
}

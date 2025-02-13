import fs from "fs/promises";
import path from "path";
import { Schema as MongooseSchema } from "mongoose";
import { getFeaturePaths } from "../../utils/helpers/other.helper";
import { generateMongooseModel } from "../../utils/generators/mongoose.generator";
import { generateInterface } from "../../utils/generators/interface.generator";
import { generateZodValidation } from "../../utils/generators/zod.generator";
import { transformMongooseSchema } from "../../utils/helpers/schema-transformer.helper";

const BASE_DIR = path.resolve(process.cwd(), "src");
const MODEL_DIR = path.join(BASE_DIR, "model");

async function createDirectory(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, "utf-8");
  console.log(`Created ${filePath}`);
}

async function generateFiles(
  modelName: string,
  mongooseSchema: MongooseSchema
): Promise<void> {
  const { INTERFACE_DIR, VALIDATION_DIR } = getFeaturePaths(
    modelName,
    BASE_DIR
  );

  // Transform the Mongoose schema to our internal schema format
  const schema = transformMongooseSchema(mongooseSchema);

  await Promise.all([
    createDirectory(MODEL_DIR),
    createDirectory(INTERFACE_DIR),
    createDirectory(VALIDATION_DIR),
  ]);

  const modelContent = generateMongooseModel(modelName, schema);
  const interfaceContent = generateInterface(modelName, schema);
  const validationContent = generateZodValidation(modelName, schema);

  await Promise.all([
    writeFile(path.join(MODEL_DIR, `${modelName}.model.ts`), modelContent),
    writeFile(
      path.join(INTERFACE_DIR, `${modelName}.interface.ts`),
      interfaceContent
    ),
    writeFile(
      path.join(VALIDATION_DIR, `${modelName}.validation.ts`),
      validationContent
    ),
  ]);
}

async function main(): Promise<void> {
  try {
    const modelName = process.argv[2]?.toLowerCase();
    if (!modelName) throw new Error("Please provide a model name");

    const modelInput = await import("./input").then((m) => m.default);
    await generateFiles(modelName, modelInput);
    console.log(`Successfully generated files for model: ${modelName}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export { generateFiles };

if (require.main === module) {
  main().catch(console.error);
}

import fs from "fs";
import path from "path";

// Base directory for models
const MODEL_DIR = path.join(process.cwd(), "src", "model");

// Template for model file
const generateModelTemplate = (
  modelName: string,
  schema: Record<string, any>
) => {
  const capitalizedName =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return `import { Schema, model, Document } from "mongoose";

export interface ${capitalizedName}Document extends Document {
${Object.entries(schema)
  .map(([key, type]) => `  ${key}: ${type};`)
  .join("\n")}
}

const ${modelName}Schema = new Schema(
  {
${Object.entries(schema)
  .map(
    ([key, type]) =>
      `    ${key}: { type: ${type.charAt(0).toUpperCase() + type.slice(1)} }`
  )
  .join(",\n")}
  },
  { timestamps: true }
);

export default model<${capitalizedName}Document>("${capitalizedName}", ${modelName}Schema);
`;
};

function createDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
}

function generateModel(modelName: string, schema: Record<string, any>) {
  // Create models directory if it doesn't exist
  createDirectory(MODEL_DIR);

  // Generate model file
  const modelContent = generateModelTemplate(modelName, schema);
  writeFile(path.join(MODEL_DIR, `${modelName}.model.ts`), modelContent);
}

// Get model details from command line args
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Please provide model name and schema");
  process.exit(1);
}

const modelName = args[0].toLowerCase();
const schema = JSON.parse(args[1]);

generateModel(modelName, schema);
console.log(`Model '${modelName}' generated successfully`);

import { routerTemplate } from "./../../utils/templates/router.templates";
import fs from "fs/promises"; // Using promises-based fs for better async handling
import path from "path";
import scriptConfig from "../../../script.config";
import { serviceTemplate } from "../../utils/templates/service.template";
import { controllerTemplate } from "../../utils/templates/controller.template";
import { repositoryTemplate } from "../../utils/templates/repository.template";
import { generateFiles as generateModel } from "../generate-model/builder";
import ModelInput from "../generate-model/input";

// Base directories from config
const { featurePath, routesPath, rootRoutesPath } = scriptConfig;

// Cache templates to avoid repeated string replacements
const templateCache = new Map();

async function createDirectory(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function writeFile(filePath: string, content: string) {
  await fs.writeFile(filePath, content);
  console.log(`Created ${filePath}`);
}

function getCachedTemplate(templateFn: Function, moduleName: string) {
  const cacheKey = `${templateFn.name}_${moduleName}`;
  if (!templateCache.has(cacheKey)) {
    const content = templateFn(moduleName).replace(/Module/g, moduleName);
    templateCache.set(cacheKey, content);
  }
  return templateCache.get(cacheKey);
}

async function updateRootRoutes(moduleName: string) {
  try {
    const rootRoutesContent = await fs.readFile(rootRoutesPath, "utf-8");

    // Check if route already exists to avoid duplicates
    if (rootRoutesContent.includes(`import ${moduleName}Routes`)) {
      console.log(`Routes for ${moduleName} already exist`);
      return;
    }

    // Prepare new content in memory before writing
    const importStatement = `import ${moduleName}Routes from "./${moduleName}/${moduleName}.routes";`;
    const routeRegistration = `  app.use("/api/${moduleName}", ${moduleName}Routes);`;

    // Split content into lines for easier manipulation
    const lines = rootRoutesContent.split("\n");

    // Find the last import line
    const lastImportIndex = lines.reduce((lastIndex, line, index) => {
      return line.trim().startsWith("import") ? index : lastIndex;
    }, -1);

    // Insert new import after the last import
    lines.splice(lastImportIndex + 1, 0, importStatement);

    // Find the closing brace and insert the route registration
    const closingBraceIndex = lines.findIndex((line) => line.trim() === "};");
    if (closingBraceIndex !== -1) {
      lines.splice(closingBraceIndex, 0, routeRegistration);
    }

    // Write back to file in a single operation
    await fs.writeFile(rootRoutesPath, lines.join("\n"));
    console.log(`Updated root routes with ${moduleName} routes`);
  } catch (error) {
    console.error(`Failed to update root routes: ${error}`);
    throw error;
  }
}

async function generateFiles(
  moduleName: string,
  directories: Record<string, string>
) {
  const fileOperations = [
    {
      path: path.join(directories.service, `${moduleName}.service.ts`),
      template: () => getCachedTemplate(serviceTemplate, moduleName),
    },
    {
      path: path.join(directories.repo, `${moduleName}.repository.ts`),
      template: () => getCachedTemplate(repositoryTemplate, moduleName),
    },
    {
      path: path.join(directories.controller, `${moduleName}.controller.ts`),
      template: () => getCachedTemplate(controllerTemplate, moduleName),
    },
    {
      path: path.join(`${routesPath}/${moduleName}`, `${moduleName}.routes.ts`),
      template: () => getCachedTemplate(routerTemplate, moduleName),
    },
  ];

  // Generate all files concurrently
  await Promise.all(
    fileOperations.map(({ path, template }) => writeFile(path, template()))
  );
}

async function generateModule(moduleName: string) {
  const directories = {
    module: path.join(featurePath, moduleName),
    service: path.join(featurePath, moduleName, "service"),
    repo: path.join(featurePath, moduleName, "repository"),
    controller: path.join(featurePath, moduleName, "controller"),
    interface: path.join(featurePath, moduleName, "interface"),
    validation: path.join(featurePath, moduleName, "validation"),
    routes: path.join(routesPath, moduleName),
  };

  try {
    // Create all directories concurrently
    await Promise.all(
      Object.values(directories).map((dir) => createDirectory(dir))
    );

    // Generate all files
    await generateFiles(moduleName, directories);

    // Update root routes
    await updateRootRoutes(moduleName);

    console.log(`Module '${moduleName}' generated successfully`);
  } catch (error) {
    console.error(`Failed to generate module: ${error}`);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Please provide a module name");
    process.exit(1);
  }

  const moduleName = args[0].toLowerCase();
  await generateModule(moduleName);
  await generateModel(moduleName, ModelInput);
}

main().catch(console.error);

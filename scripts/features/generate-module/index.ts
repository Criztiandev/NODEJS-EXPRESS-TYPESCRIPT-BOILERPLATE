import fs from "fs";
import path from "path";
import scriptConfig from "../../../script.config";
import { serviceTemplate } from "../../utils/templates/service.template";
import { controllerTemplate } from "../../utils/templates/controller.template";
import { repositoryTemplate } from "../../utils/templates/repository.template";

// Base directories from config
const { modelPath, featurePath } = scriptConfig;

const modelTemplate = `
import { Schema, model } from "mongoose";

const ModuleSchema = new Schema({
  // Define your schema here
});

export default model("Module", ModuleSchema);
`;

const interfaceTemplate = `
export interface IModule {
  // Define your interface properties here
}
`;

const routesTemplate = (moduleName: string) => `
import { Router } from "express";
import ${moduleName}Controller from "./controller/${moduleName}.controller";

const router = Router();

router.get("/", ${moduleName}Controller.handleRequest);
router.get("/:id", ${moduleName}Controller.handleRequest);
router.post("/", ${moduleName}Controller.handleRequest);
router.put("/:id", ${moduleName}Controller.handleRequest);
router.delete("/:id", ${moduleName}Controller.handleRequest);

export default router;
`;

function createDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
}

function generateModule(moduleName: string) {
  // Create module directory structure
  const moduleDir = path.join(featurePath, moduleName);
  const serviceDir = path.join(moduleDir, "service");
  const repoDir = path.join(moduleDir, "repository");
  const controllerDir = path.join(moduleDir, "controller");
  const interfaceDir = path.join(moduleDir, "interface");

  createDirectory(moduleDir);
  createDirectory(serviceDir);
  createDirectory(repoDir);
  createDirectory(controllerDir);
  createDirectory(interfaceDir);

  // Generate files
  writeFile(
    path.join(serviceDir, `${moduleName}.service.ts`),
    serviceTemplate.replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(repoDir, `${moduleName}.repository.ts`),
    repositoryTemplate.replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(controllerDir, `${moduleName}.controller.ts`),
    controllerTemplate.replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(interfaceDir, `${moduleName}.interface.ts`),
    interfaceTemplate.replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(modelPath, `${moduleName}.model.ts`),
    modelTemplate.replace(/Module/g, moduleName)
  );

  writeFile(path.join(moduleDir, "routes.ts"), routesTemplate(moduleName));

  // Register routes in main api.ts
  const apiRoutesPath = path.join(process.cwd(), "src", "routes", "api.ts");
  if (fs.existsSync(apiRoutesPath)) {
    const routeImport = `import ${moduleName}Routes from "../feature/${moduleName}/routes";\n`;
    const routeRegistration = `router.use("/${moduleName}", ${moduleName}Routes);\n`;

    let apiContent = fs.readFileSync(apiRoutesPath, "utf-8");
    apiContent = apiContent.replace(
      /import express from "express";/,
      `import express from "express";\n${routeImport}`
    );
    apiContent = apiContent.replace(
      /const router = express.Router\(\);\n/,
      `const router = express.Router();\n${routeRegistration}`
    );

    fs.writeFileSync(apiRoutesPath, apiContent);
    console.log(`Updated ${apiRoutesPath} with ${moduleName} routes`);
  }
}

// Get module name from command line args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a module name");
  process.exit(1);
}

const moduleName = args[0].toLowerCase();
generateModule(moduleName);
console.log(`Module '${moduleName}' generated successfully`);

import { routerTemplate } from "./../../utils/templates/router.templates";
import fs from "fs";
import path from "path";
import scriptConfig from "../../../script.config";
import { serviceTemplate } from "../../utils/templates/service.template";
import { controllerTemplate } from "../../utils/templates/controller.template";
import { repositoryTemplate } from "../../utils/templates/repository.template";
import { interfaceTemplate } from "../../utils/templates/interface.tempate";
import { modelTemplate } from "../../utils/templates/model.template";
import { validationTemplate } from "../../utils/templates/validationTemplate";

// Base directories from config
const { modelPath, featurePath, routesPath } = scriptConfig;

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
  const validationDir = path.join(moduleDir, "validation");
  const routesDir = path.join(routesPath, `${moduleName}`);

  createDirectory(moduleDir);
  createDirectory(serviceDir);
  createDirectory(repoDir);
  createDirectory(controllerDir);
  createDirectory(interfaceDir);
  createDirectory(validationDir);
  createDirectory(routesDir);

  // Generate files
  writeFile(
    path.join(serviceDir, `${moduleName}.service.ts`),
    serviceTemplate(moduleName).replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(repoDir, `${moduleName}.repository.ts`),
    repositoryTemplate(moduleName).replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(controllerDir, `${moduleName}.controller.ts`),
    controllerTemplate(moduleName).replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(interfaceDir, `${moduleName}.interface.ts`),
    interfaceTemplate(moduleName).replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(modelPath, `${moduleName}.model.ts`),
    modelTemplate(moduleName).replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(validationDir, `${moduleName}.validation.ts`),
    validationTemplate(moduleName).replace(/Module/g, moduleName)
  );

  writeFile(
    path.join(`${routesPath}/${moduleName}`, `${moduleName}.routes.ts`),
    routerTemplate(moduleName).replace(/Module/g, moduleName)
  );

  // Register routes the routes to the main router
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

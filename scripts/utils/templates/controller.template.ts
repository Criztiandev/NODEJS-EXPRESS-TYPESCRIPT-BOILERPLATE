export const controllerTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
import { BaseController } from "../../../core/base/controller/base.controller";
import { ${capitalizedName}Document } from "../interface/${name}.interface";
import ${capitalizedName}Service from "../service/${name}.service";

class ${capitalizedName}Controller extends BaseController<${capitalizedName}Document> {
  protected service: typeof ${capitalizedName}Service;

  constructor() {
    super(${capitalizedName}Service);
    this.service = ${capitalizedName}Service;
  }
}

export default new ${capitalizedName}Controller();
`;
};

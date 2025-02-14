export const serviceTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { ${capitalizedName}Document } from "../interface/${name}.interface";
import ${name}Repository from "../repository/${name}.repository";

class ${capitalizedName}Service extends BaseService<${capitalizedName}Document> {
  constructor(${name}Repository: BaseRepository<${capitalizedName}Document>) {
    super(${name}Repository);
  }
}

export default new ${capitalizedName}Service(${name}Repository);
`;
};

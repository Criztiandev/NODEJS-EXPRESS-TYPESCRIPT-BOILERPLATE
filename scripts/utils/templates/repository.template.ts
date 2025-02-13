export const repositoryTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
import { ${capitalizedName}Document } from "../interface/${name}.interface";
import ${name}Model from "../../../model/${name}.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class ${capitalizedName}Repository extends BaseRepository<${capitalizedName}Document> {
  constructor() {
    super(${name}Model);
  }
}

export default new ${capitalizedName}Repository();
`;
};

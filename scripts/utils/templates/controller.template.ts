export const controllerTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import ${name}Service from "../service/${name}.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";


class ${capitalizedName}Controller {
  @AsyncHandler()
  async get${capitalizedName}Details(req: Request, res: Response, next: NextFunction) {

    const { id: ${name}Id } = req.params;


    const ${name}Credentials = await ${name}Service.get${capitalizedName}(${name}Id);

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name} retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeleted${capitalizedName}Details(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: ${name}Id } = req.params;

    const ${name}Credentials = await ${name}Service.getSoftDeleted${capitalizedName}(${name}Id);

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name} retrieved successfully",
    });
  }

  /**
   * Get all ${name}s with pagination
   * /api/${name}s?search=urgent&status=open&priority=high
   * /api/${name}s?page=1&limit=10
   */
  @AsyncHandler()
  async getAll${capitalizedName}s(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const ${name}Credentials = await ${name}Service.getPaginated${capitalizedName}s(queryParams);

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name}s retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeleted${capitalizedName}s(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const ${name}Credentials = await ${name}Service.getPaginatedSoftDeleted${capitalizedName}s(
      queryParams
    );


    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name}s retrieved successfully",
    });
  }

  @AsyncHandler()
  async create${capitalizedName}(req: Request, res: Response, next: NextFunction) {
    const ${name}Credentials = await ${name}Service.create${capitalizedName}(req.body);

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name} created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeleted${capitalizedName}(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: ${name}Id } = req.params;
    const ${name}Credentials = await ${name}Service.restoreSoftDeleted${capitalizedName}(${name}Id);

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name} restored successfully",
    });
  }

  @AsyncHandler()
  async update${capitalizedName}(req: Request, res: Response, next: NextFunction) {
    const { id: ${name}Id } = req.params;
    const ${name}Credentials = await ${name}Service.update${capitalizedName}(${name}Id, req.body);

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name} updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdate${capitalizedName}s(req: Request, res: Response, next: NextFunction) {
    const { ${name}Ids, updateData } = req.body;

    const ${name}Credentials = await ${name}Service.batchUpdate${capitalizedName}sById(
      ${name}Ids,
      updateData
    );

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name}s updated successfully",
    });
  }

  @AsyncHandler()
  async softDelete${capitalizedName}(req: Request, res: Response, next: NextFunction) {
    const { id: ${name}Id } = req.params;

    const ${name}Credentials = await ${name}Service.softDelete${capitalizedName}(
      ${name}Id as unknown as ObjectId
    );

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name} deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDelete${capitalizedName}(req: Request, res: Response, next: NextFunction) {
    const { ${name}Id } = req.params;
    const ${name}Credentials = await ${name}Service.hardDelete${capitalizedName}(
      ${name}Id as unknown as ObjectId
    );

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name} deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDelete${capitalizedName}s(req: Request, res: Response, next: NextFunction) {
    const { ${name}Ids } = req.body;
    const ${name}Credentials = await ${name}Service.batchSoftDelete${capitalizedName}s(${name}Ids);

    res.status(200).json({
      payload: ${name}Credentials,
      message: "${name}s soft deleted successfully",
    });
  }
}

export default new ${capitalizedName}Controller();
`;
};

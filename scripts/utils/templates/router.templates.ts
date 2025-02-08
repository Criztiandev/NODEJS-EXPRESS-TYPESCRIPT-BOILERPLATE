export const routerTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
    import { Router } from "express";
    import ${name}Controller from "../../feature/${name}/controller/${name}.controller";

    const router = Router();

    router.get("/details/:id", ${name}Controller.get${capitalizedName}Details);
    router.get(
    "/soft-deleted/details/:id",
    ${name}Controller.getSoftDeleted${capitalizedName}Details
    );

    router.get("/all", ${name}Controller.getAll${capitalizedName}s);
    router.get("/soft-deleted/all", ${name}Controller.getAllSoftDeleted${capitalizedName}s);

    router.post("/create", ${name}Controller.create${capitalizedName});
    router.post("/restore/soft-deleted/:id", ${name}Controller.restoreSoftDeleted${capitalizedName});

    router.put("/details/:id", ${name}Controller.update${capitalizedName});

    router.delete("/details/:id", ${name}Controller.softDelete${capitalizedName});
    router.delete("/details/hard/:id", ${name}Controller.hardDelete${capitalizedName});

    export default router;
  `;
};

export const validationTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
  import { z } from "zod";

  const ${capitalizedName}Validation = z.object({
    // Define your schema properties here
  });

  export default ${capitalizedName}Validation;
    `;
};

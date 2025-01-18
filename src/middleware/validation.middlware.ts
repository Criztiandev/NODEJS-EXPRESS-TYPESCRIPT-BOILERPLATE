import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { AnyZodObject, ZodError, ZodEffects } from "zod";

type ZodSchema = AnyZodObject | ZodEffects<AnyZodObject>;

class ValidationMiddleware {
  validate = (schema: ZodSchema) =>
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { body } = req;

          const sanitizedBody = schema.safeParse(body);

          if (sanitizedBody.error) {
            const { errors } = sanitizedBody.error;
            const currentError = `${errors[0].path[0]} ${errors[0].message}`;

            res.status(400);
            throw new Error(currentError);
          }

          next();
        } catch (error) {
          throw new Error(error as any);
        }
      }
    );
}

export default new ValidationMiddleware();

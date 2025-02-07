import { z } from "zod";

const UpdateAccountValidation = z.object({
  firstName: z.string().min(3),
  middleName: z.string().min(3).optional(),
  lastName: z.string().min(3),

  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["user", "admin"]).optional(),
  refreshToken: z.string().optional(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.date().optional(),
});

export default UpdateAccountValidation;

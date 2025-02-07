import { z } from "zod";

const RegisterValidation = z.object({
  firstName: z.string().min(3),
  middleName: z.string().min(3).optional(),
  lastName: z.string().min(3),

  email: z.string().email(),
  password: z.string().min(8),
});

export default RegisterValidation;

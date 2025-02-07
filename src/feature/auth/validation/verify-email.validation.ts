import { z } from "zod";

const VerifyEmailValidation = z.object({
  email: z.string().email(),
});

export default VerifyEmailValidation;

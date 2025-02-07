import { z } from "zod";

const ForgotPasswordValidation = z.object({
  email: z.string().email(),
});

export default ForgotPasswordValidation;

import { z } from "zod";
import { UserValidation } from "../../user/validation/user.validation";

const LoginValidation = UserValidation.pick({
  email: true,
}).extend({
  password: z.string().min(8),
});

export default LoginValidation;

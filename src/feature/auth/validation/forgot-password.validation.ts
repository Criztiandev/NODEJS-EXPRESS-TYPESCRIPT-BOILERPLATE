import { UserValidation } from "../../user/validation/user.validation";

const ForgotPasswordValidation = UserValidation.pick({
  email: true,
});

export default ForgotPasswordValidation;

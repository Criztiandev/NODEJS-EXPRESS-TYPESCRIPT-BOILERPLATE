import { UserValidation } from "../../user/validation/user.validation";

const ResetPasswordValidation = UserValidation.pick({
  password: true,
});

export default ResetPasswordValidation;

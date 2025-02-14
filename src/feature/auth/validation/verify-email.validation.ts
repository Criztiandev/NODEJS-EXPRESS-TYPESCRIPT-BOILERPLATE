import { UserValidation } from "../../user/validation/user.validation";

const VerifyEmailValidation = UserValidation.pick({
  email: true,
});

export default VerifyEmailValidation;

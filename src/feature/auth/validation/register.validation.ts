import { UserValidation } from "../../user/validation/user.validation";

const RegisterValidation = UserValidation.omit({
  role: true,
});

export default RegisterValidation;

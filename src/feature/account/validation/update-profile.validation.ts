import { UserValidation } from "../../user/validation/user.validation";

// extend the update account validation to user validation
const UpdateAccountValidation = UserValidation.partial();

export default UpdateAccountValidation;

import { z } from "zod";

const OtpValidation = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

export default OtpValidation;

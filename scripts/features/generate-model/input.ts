export const input = {
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },

  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },

  address: { type: String, required: true },
  barangay: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },

  role: { type: String, required: true, enum: ["admin", "user"] },
};

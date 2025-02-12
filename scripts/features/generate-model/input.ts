export const input = {
  userId: { type: String, required: true, ref: "User" },
  position: { type: String, required: true },
  termStart: { type: Date, required: true },
  termEnd: { type: Date, required: true },
  isActive: { type: Boolean, required: true },
};

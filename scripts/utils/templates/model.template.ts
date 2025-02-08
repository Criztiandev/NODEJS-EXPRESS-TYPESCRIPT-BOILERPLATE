export const modelTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
import mongoose, { ObjectId, Query } from "mongoose";

export interface ${capitalizedName} {
  _id?: ObjectId | string;
  // Define your interface properties here

}

const ${name}Schema = new mongoose.Schema(
  {
   // Define your schema properties here
   isDeleted: {
    type: Boolean,
    default: false,
   }
  },
  {
    timestamps: true,
  }
);

${name}Schema.pre(/^find/, function (this: Query<any, Document>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model("${capitalizedName}", ${name}Schema);
  `;
};

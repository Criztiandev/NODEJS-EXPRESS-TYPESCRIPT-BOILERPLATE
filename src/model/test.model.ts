
import mongoose, { ObjectId, Query } from "mongoose";

export interface Test {
  _id?: ObjectId | string;
  // Define your interface properties here

}

const testSchema = new mongoose.Schema(
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

testSchema.pre(/^find/, function (this: Query<any, Document>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model("Test", testSchema);
  
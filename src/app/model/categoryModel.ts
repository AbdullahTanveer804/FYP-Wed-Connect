import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
}

const messageSchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Category =
  (mongoose.models.messages as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>("categories", messageSchema);

export default Category;

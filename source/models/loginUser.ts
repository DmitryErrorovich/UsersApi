import mongoose, { Schema } from "mongoose";
import logging from "../config/logging";
import ILoginUsers from "../interfaces/loginUsers";

const LoginUsersSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024
    },
    date: {
      type: Date,
      default: Date.now
    },
  }
);

LoginUsersSchema.post<ILoginUsers>("save", function () {
  logging.info("Mongo", "Checkout the user: ", this);
});

export default mongoose.model<ILoginUsers>("loginUsers", LoginUsersSchema);

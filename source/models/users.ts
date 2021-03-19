import mongoose, { Schema } from "mongoose";
import logging from "../config/logging";
import IUsers from "../interfaces/users";

const UsersSchema: Schema = new Schema(
  {
    gender: String,
    name: {
      title: String,
      first: String,
      last: String,
    },
    location: {
      street: {
        number: Number,
        name: String,
      },
      city: String,
      state: String,
      postcode: String,
      country: String,
      coordinates: {
        latitude: String,
        longitude: String,
      },
      timezone: {
        offset: String,
        description: String,
      },
    },
    email: String,
    login: {
      uuid: String,
      username: String,
      password: String,
      salt: String,
      md5: String,
      sha1: String,
      sha256: String,
    },
    dob: {
      date: String,
      age: Number,
    },
    registered: {
      date: String,
      age: Number,
    },
    phone: String,
    cell: String,
    local_id: {
      name: String,
      value: String,
    },
    picture: {
      large: String,
      medium: String,
      thumbnail: String,
    },
    nat: String,
  },
  {
    timestamps: true,
  }
);

UsersSchema.post<IUsers>("save", function () {
  logging.info("Mongo", "Checkout the book we just saved: ", this);
});

export default mongoose.model<IUsers>("Users", UsersSchema);

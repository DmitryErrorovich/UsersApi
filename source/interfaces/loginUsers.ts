import { Document } from "mongoose";

export default interface ILoginUsers extends Document {
  name: string
  email: string,
  password: string,
  date: Date,
}

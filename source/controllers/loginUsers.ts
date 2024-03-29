import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import LoginUser from "../models/loginUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  registerValidation,
  loginValidation
} from "../validation/authValidation";
import config from "../config/config";

const register = async (req: Request, res: Response, next: NextFunction) => {
  // VALIDATE
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exist
  const isEmailExist = await LoginUser.find({ email: req.body.email });
  console.log(isEmailExist)
  if (isEmailExist.length) {
    return res.status(400).send("Email already exist");
  }

  // Hash pass
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // create new
  const user = new LoginUser({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

// LOGIN
const login = async (req: Request, res: Response, next: NextFunction) => {
  // VALIDATE
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Check if email
  const user = await LoginUser.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email or password is wrong");
  }
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Invalid password");
  }

  //token
  const token = jwt.sign({ _id: user._id }, config.jwt);

  res.header("auth-token", token).send({token});
};

export const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

export default { login: allowCors(login), register: allowCors(register) };

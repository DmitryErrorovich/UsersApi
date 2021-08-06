import jwt from "jsonwebtoken";
import config from "./config/config";

//private
export const auth = (req,res,next) => {
  const token = req.header("auth-token");
  if(!token) {
    return res.status(401).send("Access Denied")
  }

  try {
    const verified = jwt.verify(token, config.jwt)
    req.user = verified;
    next()
  } catch (error) {
    res.status(400).send("Invalid Token")
  }
}
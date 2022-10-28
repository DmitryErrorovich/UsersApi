import jwt from "jsonwebtoken";
import config from "../config/config";
import LoginUser from "../models/loginUser";

export const authCheck = async (req, res, next) => {
    try {
        console.log({ headers: req.headers['authorization'].split(" ")[1] })
        if (!req.headers['authorization']) { res.status(401) }
        const token = req.headers['authorization'].split(" ")[1];
        const { _id: id } = await jwt.verify(token, config.jwt);
        const user = LoginUser.findOne({ _id: id })
        if (!user) {
            return res.status(401).send({ message: "Not Authorized" });
        }
        req.user = user;
        return next()
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}
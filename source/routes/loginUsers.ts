import express from "express";
import controller from "../controllers/loginUsers";

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

export = router;

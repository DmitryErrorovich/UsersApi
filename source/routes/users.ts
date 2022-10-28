import express from "express";
import controller from "../controllers/users";
import { authCheck } from "../middlewares/authCheck";

const router = express.Router();

router.put("/put/users", controller.putUsers);

router.get("/get/users", controller.getAllUsers);
router.get("/get/user", authCheck, controller.getUser);

export = router;

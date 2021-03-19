import express from "express";
import controller from "../controllers/users";

const router = express.Router();

router.put("/put/users", controller.putUsers);

router.get("/get/users", controller.getAllUsers);
router.get("/get/user", controller.getUser);

export = router;

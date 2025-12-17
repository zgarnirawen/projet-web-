import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login.bind(controller));
router.post("/register", controller.register.bind(controller));
router.post("/google", controller.googleAuth.bind(controller));

export default router;

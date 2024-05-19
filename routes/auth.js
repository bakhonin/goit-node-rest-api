import express from "express";

import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  emailSchema,
} from "../models/user.js";
import {
  registerUser,
  verifyEmail,
  resendVerifyEmail,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
} from "../controllers/auth.js";
import { authenticate, upload } from "../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerUser);

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);

authRouter.post("/login", validateBody(loginSchema), loginUser);

authRouter.get("/current", authenticate, getCurrentUser);

authRouter.post("/logout", authenticate, logoutUser);

authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;

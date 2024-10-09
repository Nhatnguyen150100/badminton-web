"use-strict";
import express from "express";
import authController from "../controllers/auth/authController";
import authMiddleware from "../middleware/authMiddleware";
const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post(
  "/register",
  authMiddleware.checkUserExist,
  authController.register
);

export default authRouter;

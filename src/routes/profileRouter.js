"use-strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import multer from "multer";
import profileController from "../controllers/profileController";
const profileRouter = express.Router();
import path, { join } from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, '..', '..', 'public', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const user = req.user;
    const extension = path.extname(file.originalname);
    const customName = `${user.id}${extension}`;
    req.avatar = `${process.env.BASE_URL_SERVER}/avatars/${customName}`;
    cb(null, customName);
  },
});

const upload = multer({ storage });

profileRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  upload.single('avatar'),
  profileController.updateProfile
);

export default profileRouter;

import path, { join } from "path";
import fs from "fs";
import multer from "multer";

const uploadDir = path.join(__dirname, "..", "..", "public", "avatars");
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

const uploadAvatar = multer({ storage });

const uploadDirCourt = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "badminton-court"
);
if (!fs.existsSync(uploadDirCourt)) {
  fs.mkdirSync(uploadDirCourt);
}

const storageCourt = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirCourt);
  },
  filename: (req, file, cb) => {
    const user = req.user;
    const extension = path.extname(file.originalname);
    const customName = `${user.id}${extension}`;
    req.imageCourt = `${process.env.BASE_URL_SERVER}/badminton-court/${customName}`;
    cb(null, customName);
  },
});

const uploadImgCourt = multer({ storage: storageCourt });

export { uploadAvatar, uploadImgCourt };

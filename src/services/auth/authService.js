"use strict";
import bcrypt from "bcrypt";
import logger from "../../config/winston";
import db from "../../models";
import ROLE_DEFINE from "../../constants/role";

const authService = {
  login: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { email: email },
          raw: true,
        });
        if (user.role === "USER") {
          await db.LoginLog.create({
            logTime: new Date(),
            idUser: user.id,
          });
        }
        if (!user || Object.keys(user).length === 0) {
          resolve({
            data: null,
            message: "We couldn't find your email address",
          });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          resolve({
            data: null,
            message: "Incorrect password",
          });
        } else {
          delete user.password;
          resolve({
            data: user,
            message: "Login successfully",
          });
        }
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },
  register: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({
          email: email,
          password: hashedPassword,
          role: ROLE_DEFINE.USER,
        });
        delete newUser.dataValues.password;
        resolve({
          data: newUser,
          message: "Registration successfully",
        });
      } catch (error) {
        logger.error(error.parent);
        reject(error);
      }
    });
  },
  checkUserExists: (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { email: email },
        });
        if (user) {
          resolve({
            data: true,
            message: "Email already exists",
          });
        } else {
          resolve({
            data: false,
            message: "Email available",
          });
        }
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  },
};

export default authService;

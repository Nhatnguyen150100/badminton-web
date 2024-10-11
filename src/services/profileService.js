const { default: logger } = require("../config/winston");
const { default: db } = require("../models");

const profileService = {
  updateProfile: (
    idUser,
    fullName,
    gender,
    avatar,
    phoneNumber
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findByPk(idUser);
        if (!user || Object.keys(user).length === 0) {
          resolve({
            data: null,
            message: "We couldn't find your username",
          });
        }
        const updateProfile = await db.User.update(
          {
            fullName,
            gender,
            avatar,
            phoneNumber,
          },
          {
            where: { id: idUser },
          }
        );
        const userUpdated = await db.User.findByPk(idUser);
        if (updateProfile) {
          resolve({
            data: userUpdated,
            message: "Profile updated successfully",
          });
          return;
        }
        reject({
          data: null,
          message: "Failed to update profile",
        });
      } catch (error) {
        logger.error(error.message);
        reject(error.message);
      }
    });
  },
};

export default profileService;

const { default: db } = require("../models");

const badmintonCourtService = {
  getBadmintonCourt: (courtId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const court = await db.BadmintonCourt.findByPk(courtId, { raw: true });
        if (court) {
          resolve({
            data: court,
            message: "Badminton court found successfully",
          });
          return;
        }
        reject({
          data: null,
          message: "Badminton court not found",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  createBadmintonCourt: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, address, lang, lat, imageCourt, description } = data;
        const newCourt = await db.BadmintonCourt.create({
          userId,
          name,
          address,
          lang,
          lat,
          imageCourt,
          description,
        });
        if (newCourt) {
          resolve({
            data: newCourt,
            message: "Badminton court created successfully",
          });
          return;
        }
        reject({
          data: null,
          message: "Failed to create badminton court",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  updateBadmintonCourt: (courtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, address, lang, lat, imageCourt, description } = data;
        const updatedCourt = await db.BadmintonCourt.update(
          { name, address, lang, lat, imageCourt, description },
          { where: { id: courtId } }
        );
        if (updatedCourt) {
          resolve({
            data: updatedCourt,
            message: "Badminton court updated successfully",
          });
          return;
        }
        reject({
          data: null,
          message: "Failed to update badminton court",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  changeStatusBadmintonCourt: (courtId, status) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedStatus = await db.BadmintonCourt.update(
          { status },
          { where: { id: courtId } }
        );
        if (updatedStatus) {
          resolve({
            message: "Changed status of badminton courts successfully",
          });
          return;
        }
        reject({
          message: "Failed to change status of badminton courts",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  deleteBadmintonCourt: (courtId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedCourt = await db.BadmintonCourt.destroy({
          where: { id: courtId },
        });
        if (deletedCourt) {
          resolve({
            data: deletedCourt,
            message: "Badminton court deleted successfully",
          });
          return;
        }
        reject({
          data: null,
          message: "Failed to delete badminton court",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default badmintonCourtService;

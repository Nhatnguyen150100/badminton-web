import { Op } from "sequelize";
import logger from "../config/winston";
import onRemoveParams from "../utils/remove-params";

const { default: db } = require("../models");

const badmintonCourtService = {
  getListBadmintonCourt: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike, district, ward } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {};
        if (nameLike) {
          query = {
            name: {
              [Op.like]: `%${nameLike}%`,
            },
          };
        }
        if (district) {
          query = {
            ...query,
            district,
          };
        }
        if (ward) {
          query = {
            ...query,
            ward,
          };
        }
        const option = onRemoveParams(
          {
            where: query,
            limit: Number(limit),
            offset,
            order: [["createdAt", "ASC"]],
            raw: true,
            nest: true,
            distinct: true,
          },
          [0]
        );
        const result = await db.BadmintonCourt.findAndCountAll(option);
        const court = result.rows;
        const totalCount = result.count;
        resolve({
          data: {
            content: court,
            totalCount,
          },
          message: "List of courts retrieved successfully",
        });
      } catch (error) {
        logger.error(error.message);
        reject(error);
      }
    });
  },
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
        logger.error(error.message);
        reject(error);
      }
    });
  },
  createBadmintonCourt: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          name,
          address,
          lang,
          lat,
          imageCourt,
          description,
          ward,
          district,
        } = data;
        const newCourt = await db.BadmintonCourt.create({
          userId,
          name,
          address,
          lang,
          lat,
          imageCourt,
          description,
          district,
          ward,
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
        logger.error(error.message);
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
            message: "Badminton court updated successfully",
          });
          return;
        }
        reject({
          message: "Failed to update badminton court",
        });
      } catch (error) {
        logger.error(error.message);
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
        logger.error(error.message);
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
        logger.error(error.message);
        reject(error);
      }
    });
  },
};

export default badmintonCourtService;

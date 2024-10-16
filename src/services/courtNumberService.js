import { Op } from "sequelize";
import onRemoveParams from "../utils/remove-params";
import { BaseErrorResponse } from "../config/baseReponse";

const { default: logger } = require("../config/winston");
const { default: db } = require("../models");

const courtNumberService = {
  getListCourtNumber: (badmintonCourtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          badmintonCourtId
        };
        if (nameLike) {
          query = {
            ...query,
            name: {
              [Op.like]: `%${nameLike}%`,
            },
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
        const result = await db.CourtNumber.findAndCountAll(option);
        if (!result) {
          reject({
            data: null,
            message: "No court numbers found",
          });
          return;
        }
        const courtNumbers = result.rows;
        const totalCount = result.count;
        resolve({
          data: {
            content: courtNumbers,
            totalCount,
          },
          message: "List of court numbers retrieved successfully",
        });
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
  createCourtNumber: (badmintonCourtId, name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const courtNumberData = { badmintonCourtId, name };
        const newCourtNumber = await db.CourtNumber.create(courtNumberData);
        resolve({
          data: newCourtNumber,
          message: "Court number created successfully",
        });
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
  getCourtNumber: (courtNumberId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const courtNumber = await db.CourtNumber.findByPk(courtNumberId, {
          raw: true,
        });
        if (courtNumber) {
          resolve({
            data: courtNumber,
            message: "Court number found successfully",
          });
        } else {
          reject({
            data: null,
            message: "Court number not found",
          });
        }
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
  updateCourtNumber: (courtNumberId, name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await courtNumberService.getCourtNumber(courtNumberId);
        if (!data) {
          reject({
            message: "Court number not found",
          });
          return;
        }
        const updatedCourtNumber = await db.CourtNumber.update(
          { name },
          { where: { id: courtNumberId } }
        );
        if (updatedCourtNumber) {
          resolve({
            message: "Court number updated successfully",
          });
        } else {
          reject({
            message: "Failed to update court number",
          });
        }
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
  deleteCourtNumber: (courtNumberId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await courtNumberService.getCourtNumber(courtNumberId);
        if (!data) {
          reject({
            message: "Court number not found",
          });
          return;
        }
        const deletedCourtNumber = await db.CourtNumber.destroy({
          where: { id: courtNumberId },
        });
        if (deletedCourtNumber) {
          resolve({
            message: "Court number deleted successfully",
          });
        } else {
          reject({
            message: "Failed to delete court number",
          });
        }
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
};

export default courtNumberService;

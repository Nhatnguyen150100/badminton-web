import { where } from "sequelize";
import { BaseErrorResponse } from "../config/baseReponse";

const { default: logger } = require("../config/winston");
const { default: db } = require("../models");
const { default: onRemoveParams } = require("../utils/remove-params");

const timeBookingService = {
  getListTimeBookings: (badmintonCourtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          badmintonCourtId,
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
            order: [["createdAt", "DESC"]],
            raw: true,
            nest: true,
            distinct: true,
          },
          [0]
        );
        const result = await db.TimeBooking.findAndCountAll(option);
        if (!result) {
          reject({
            data: null,
            message: "No court numbers found",
          });
          return;
        }
        const timeBookings = result.rows;
        const totalCount = result.count;
        resolve({
          data: {
            content: timeBookings,
            totalCount,
          },
          message: "List of time bookings retrieved successfully",
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
  createTimeBooking: (badmintonCourtId, startTime, endTime) => {
    return new Promise(async (resolve, reject) => {
      try {
        const timeBookingData = { badmintonCourtId, startTime, endTime };
        const timeBooking = await db.TimeBooking.create(timeBookingData);
        resolve({
          data: timeBooking,
          message: "Time booking created successfully",
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
  updateTimeBooking: (timeBookingId, startTime, endTime) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = { startTime, endTime };
        const timeBooking = await db.TimeBooking.findByPk(timeBookingId, {
          raw: true,
        });
        if (!timeBooking) {
          reject({
            message: "Time booking not found",
          });
        }
        const updated = await db.TimeBooking.update(data, {
          where: {
            id: timeBookingId,
          },
        });
        if (updated) {
          resolve({
            message: "Time booking updated successfully",
          });
          return;
        }
        reject({
          message: "Failed to update time booking",
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
  deleteTimeBooking: (timeBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const timeBooking = await db.TimeBooking.findByPk(timeBookingId);
        if (!timeBooking) {
          reject({
            message: "Time booking not found",
          });
        }
        await db.TimeBooking.destroy({
          where: {
            id: timeBookingId,
          },
        });
        resolve({
          message: "Time booking deleted successfully",
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
};

export default timeBookingService;

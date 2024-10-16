import { Op } from "sequelize";
import logger from "../config/winston";
import { DEFINE_STATUS } from "../constants/status";
import db from "../models";
import onRemoveParams from "../utils/remove-params";
import { BaseErrorResponse } from "../config/baseReponse";

const userBookingService = {
  createBooking: (userId, scheduleId, note) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newBooking = await db.UserBooking.create({
          userId,
          scheduleId,
          note,
        });
        resolve({
          data: newBooking,
          message: "Booking created successfully",
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
  getBookingsByUser: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          userId,
        };
        const option = onRemoveParams(
          {
            where: query,
            attributes: ["status"],
            limit: Number(limit),
            offset,
            order: [["createdAt", "ASC"]],
            raw: true,
            nest: true,
            distinct: true,
          },
          [0]
        );
        const result = await db.UserBooking.findAndCountAll({
          include: [
            {
              model: db.Schedule,
              as: "schedule",
              attributes: ["appointmentDate", "constBooking"],
              include: [
                {
                  model: db.BadmintonCourt,
                  as: "badmintonCourt",
                  include: [
                    {
                      model: db.CourtNumber,
                      as: "courtNumbers",
                      attributes: ["name"],
                    },
                    {
                      model: db.TimeBooking,
                      as: "timeBookings",
                      attributes: ["startTime", "endTime"],
                    },
                  ],
                  attributes: ["name", "address"],
                },
              ],
            },
          ],
          ...option,
        });
        if (!result) {
          reject({
            data: null,
            message: "No schedules booking found",
          });
          return;
        }
        const schedules = result.rows;
        const totalCount = result.count;
        resolve({
          data: {
            content: schedules,
            totalCount,
          },
          message: "List of schedules booking retrieved successfully",
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
  getBookingByBadmintonCourt: (badmintonCourtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          id: badmintonCourtId,
        };
        const option = onRemoveParams(
          {
            limit: Number(limit),
            offset,
            attributes: ["status"],
            order: [["createdAt", "ASC"]],
            raw: true,
            nest: true,
            distinct: true,
          },
          [0]
        );
        const result = await db.UserBooking.findAndCountAll({
          include: [
            {
              model: db.User,
              as: "user",
              required: true,
              attributes: ["fullName", "email"],
            },
            {
              model: db.Schedule,
              as: "schedule",
              required: true,
              attributes: ["appointmentDate", "constBooking"],
              include: [
                {
                  model: db.BadmintonCourt,
                  as: "badmintonCourt",
                  where: query,
                  include: [
                    {
                      model: db.CourtNumber,
                      as: "courtNumbers",
                      attributes: ["name"],
                    },
                    {
                      model: db.TimeBooking,
                      as: "timeBookings",
                      attributes: ["startTime", "endTime"],
                    },
                  ],
                  attributes: [],
                },
              ],
            },
          ],
          ...option,
        });
        if (!result) {
          reject({
            data: null,
            message: "No schedules booking found",
          });
          return;
        }
        const schedules = result.rows;
        const totalCount = result.count;
        resolve({
          data: {
            content: schedules,
            totalCount,
          },
          message: "List of schedules booking retrieved successfully",
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
  changeAcceptUserBooking: (userBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentStatus = await db.UserBooking.findOne({
          where: { id: userBookingId },
          raw: true,
        });
        if(currentStatus.status === DEFINE_STATUS.CANCELED) {
          return reject({
            status: 400,
            message: "User booking has been canceled",
          })
        }
        const status = DEFINE_STATUS.ACCEPTED;
        const otherStatus = DEFINE_STATUS.DENIED;
        const updatedStatus = await db.UserBooking.update(
          { status },
          { where: { id: userBookingId } }
        );
        await db.UserBooking.update(
          { status: otherStatus },
          {
            where: {
              scheduleId: currentStatus.scheduleId,
              status: {
                [Op.ne]: status,
              },
            },
          }
        );
        if (updatedStatus) {
          return resolve({
            message: "Accept user booking successfully",
          });
        }
        return reject({
          message: "Failed to accept user booking",
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
  cancelUserBooking: (userBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const status = DEFINE_STATUS.CANCELED;
        const updatedStatus = await db.UserBooking.update(
          { status },
          { where: { id: userBookingId } }
        );
        if (updatedStatus) {
          resolve({
            message: "Cancel user booking successfully",
          });
          return;
        }
        reject({
          message: "Failed to cancel user booking",
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
  }
};

export default userBookingService;

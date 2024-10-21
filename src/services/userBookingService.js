import { Op } from "sequelize";
import logger from "../config/winston";
import { DEFINE_SCHEDULE_STATUS, DEFINE_STATUS } from "../constants/status";
import db from "../models";
import onRemoveParams from "../utils/remove-params";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseReponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";

const userBookingService = {
  createBooking: (userId, scheduleId, note) => {
    return new Promise(async (resolve, reject) => {
      try {
        const checkIsBooking = await db.UserBooking.findOne({
          where: {
            userId,
            scheduleId,
          },
        });
        if (checkIsBooking) {
          return reject(
            new BaseErrorResponse({
              message: "Bạn đã đặt lịch cho ngày này",
            })
          );
        }
        const newBooking = await db.UserBooking.create({
          userId,
          scheduleId,
          note,
          status: DEFINE_STATUS.PENDING_APPROVAL,
        });
        return resolve(
          new BaseSuccessResponse({
            data: newBooking,
            message: "Đặt lịch thành công",
          })
        );
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
        const { page, limit, appointmentDate } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          userId,
          appointmentDate
        };
        const option = onRemoveParams(
          {
            where: query,
            attributes: ["id", "status", "note"],
            limit: Number(limit),
            offset,
            order: [["createdAt", "DESC"]],
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
              required: false,
              include: [
                {
                  model: db.BadmintonCourt,
                  as: "badmintonCourt",
                  include: [
                    {
                      model: db.User,
                      as: "user",
                    },
                  ],
                },
                {
                  model: db.CourtNumber,
                  as: "courtNumber",
                },
                {
                  model: db.TimeBooking,
                  as: "timeBooking",
                },
              ],
            },
          ],
          ...option,
        });
        const schedules = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: schedules,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of time bookings retrieved successfully",
          })
        );
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
            attributes: ["id", "status", "note"],
            order: [["createdAt", "DESC"]],
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
              attributes: ["fullName", "email", "phoneNumber"],
            },
            {
              model: db.Schedule,
              as: "schedule",
              required: true,
              attributes: ["appointmentDate", "constBooking"],
              include: [
                {
                  model: db.CourtNumber,
                  as: "courtNumber",
                  attributes: ["name"],
                },
                {
                  model: db.TimeBooking,
                  as: "timeBooking",
                  attributes: ["startTime", "endTime"],
                },
                {
                  model: db.BadmintonCourt,
                  as: "badmintonCourt",
                  attributes: [],
                  where: query,
                  raw: true,
                },
              ],
            },
          ],
          ...option,
        });
        const schedules = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: schedules,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of schedules booking retrieved successfully",
          })
        );
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
        if (currentStatus.status === DEFINE_STATUS.CANCELED) {
          return resolve(
            new BaseErrorResponse({
              message: "Lịch đã bị hủy bởi người đặt",
            })
          );
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
              id: {
                [Op.ne]: userBookingId,
              },
            },
          }
        );
        await db.Schedule.update(
          {
            status: DEFINE_SCHEDULE_STATUS.NOT_AVAILABLE,
          },
          {
            where: {
              id: currentStatus.scheduleId,
            },
          }
        );
        if (updatedStatus) {
          return resolve(
            new BaseSuccessResponse({
              message: "Chấp nhận người đặt lịch thành công",
            })
          );
        }
        return resolve(
          new BaseErrorResponse({
            message: "Chấp nhận người đặt lịch thất bại",
          })
        );
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
  deniedUserBooking: (userBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const status = DEFINE_STATUS.DENIED;
        const updatedStatus = await db.UserBooking.update(
          { status },
          { where: { id: userBookingId } }
        );
        if (updatedStatus) {
          return resolve(
            new BaseSuccessResponse({
              message: "Từ chối người đặt lịch thành công",
            })
          );
        }
        return resolve(
          new BaseErrorResponse({
            message: "Từ chối người đặt lịch thất bại",
          })
        );
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
        const currentStatus = await db.UserBooking.findOne({
          where: { id: userBookingId },
          raw: true,
        });
        if (currentStatus.status === DEFINE_STATUS.ACCEPTED) {
          return resolve(
            new BaseErrorResponse({
              message: "Lịch đã được chấp nhận bởi người đặt",
            })
          );
        }
        const status = DEFINE_STATUS.CANCELED;
        const updatedStatus = await db.UserBooking.update(
          { status },
          { where: { id: userBookingId } }
        );
        if (updatedStatus) {
          return resolve(
            new BaseSuccessResponse({
              message: "Hủy lịch thành công",
            })
          );
        }
        return resolve(
          new BaseErrorResponse({
            message: "Hủy lịch thất bại",
          })
        );
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

export default userBookingService;

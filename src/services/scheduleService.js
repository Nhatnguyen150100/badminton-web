import { Op } from "sequelize";
import logger from "../config/winston";
import db from "../models";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import onRemoveParams from "../utils/remove-params";
dayjs.extend(customParseFormat);

const scheduleService = {
  checkScheduleExist: (courtNumberId, timeBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const exitsSchedule = await db.Schedule.findOne({
          where: {
            courtNumberId,
            timeBookingId,
          },
        });
        if (exitsSchedule) {
          resolve(true);
          return;
        }
        resolve(false);
      } catch (error) {
        logger.error(error.message);
        reject({status: 400, message: error.message});
      }
    });
  },
  createSchedule: (
    badmintonCourtId,
    courtNumberId,
    timeBookingId,
    appointmentDate,
    constBooking
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist = await scheduleService.checkScheduleExist(
          courtNumberId,
          timeBookingId
        );
        if (isExist) {
          reject({
            status: 400,
            message: "This court already has an appointment at this time",
          });
          return;
        }
        const data = {
          badmintonCourtId,
          courtNumberId,
          timeBookingId,
          appointmentDate: dayjs(appointmentDate).toDate(),
          constBooking,
        };
        const createdSchedule = await db.Schedule.create(data);
        if (createdSchedule) {
          resolve({
            data: createdSchedule,
            message: "Schedule created successfully",
          });
          return;
        }
        reject({
          message: "Failed to create schedule",
        });
      } catch (error) {
        logger.error(error.message);
        reject({status: 400, message: error.message});
      }
    });
  },
  updatedSchedule: (
    scheduleId,
    courtNumberId,
    timeBookingId,
    appointmentDate,
    constBooking
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist = await scheduleService.checkScheduleExist(
          courtNumberId,
          timeBookingId
        );
        if (!isExist) {
          reject({
            message: "This court doesn't have an appointment at this time",
          });
          return;
        }
        const updatedSchedule = await db.Schedule.update(
          {
            courtNumberId,
            timeBookingId,
            appointmentDate,
            constBooking,
          },
          {
            where: { id: scheduleId },
          }
        );
        if (updatedSchedule[0]) {
          resolve({
            message: "Schedule updated successfully",
          });
          return;
        }
        reject({
          message: "Failed to update schedule",
        });
      } catch (error) {
        logger.error(error.message);
        reject({status: 400, message: error.message});
      }
    });
  },
  deleteSchedule: (scheduleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedSchedule = await db.Schedule.destroy({
          where: { id: scheduleId },
        });
        if (deletedSchedule) {
          resolve({
            message: "Schedule deleted successfully",
          });
          return;
        }
        reject({
          message: "Failed to delete schedule",
        });
      } catch (error) {
        logger.error(error.message);
        reject({status: 400, message: error.message});
      }
    });
  },
  getListSchedule: (badmintonCourtId, data) => {
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
        const result = await db.Schedule.findAndCountAll(option);
        if (!result) {
          reject({
            data: null,
            message: "No schedule numbers found",
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
          message: "List of schedule retrieved successfully",
        });
      } catch (error) {
        logger.error(error.message);
        reject({status: 400, message: error.message});
      }
    });
  },
};

export default scheduleService;

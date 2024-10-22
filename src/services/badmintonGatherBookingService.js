import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseReponse";
import logger from "../config/winston";
import { DEFINE_STATUS } from "../constants/status";
import db from "../models";

const badmintonGatherBookingService = {
  createGatherBooking: (badmintonGatherId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const badmintonGather = await db.BadmintonGather.findByPk(
          badmintonGatherId
        );
        const { userId, numberMale, numberFemale, note } = data;
        if (
          numberMale > badmintonGather.totalMale ||
          numberFemale > badmintonGather.totalFemale
        ) {
          return reject(
            new BaseErrorResponse({
              message: "Số người tham gia vượt quá số người đã đăng ký",
            })
          );
        }
        const created = await db.BadmintonGatherBooking.create({
          badmintonGatherId,
          userId,
          numberMale,
          numberFemale,
          note,
        });
        if (created) {
          return resolve(
            new BaseSuccessResponse({
              data: created,
              message: "Gửi thông tin tham gia thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Gửi thông tin tham gia thất bại",
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
  acceptGatherBooking: (gatherBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const badmintonGather = await db.BadmintonGatherBooking.findOne({
          where: { id: gatherBookingId },
          raw: true,
          nested: true,
          include: [
            {
              model: db.BadmintonGather,
              as: "badmintonGather",
            },
          ],
        });
        const status = DEFINE_STATUS.ACCEPTED;
        const updated = await db.BadmintonGatherBooking.update(
          { status },
          {
            where: { id: gatherBookingId },
            returning: true,
          }
        );
        await db.BadmintonGather.update(
          {
            totalMale:
              badmintonGather.badmintonGather.totalMale -
              badmintonGather.numberMale,
            totalFemale:
              badmintonGather.badmintonGather.totalFemale -
              badmintonGather.numberFemale,
          },
          {
            where: { id: badmintonGather.badmintonGather.id },
          }
        );
        if (updated[0] > 0) {
          return resolve(
            new BaseSuccessResponse({
              message: "Chấp nhận thông tin tham gia thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Chấp nhận thông tin tham gia thất bại",
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
  deniedGatherBooking: (gatherBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const status = DEFINE_STATUS.DENIED;
        const deleted = await db.BadmintonGatherBooking.update(
          { status },
          {
            where: { id: gatherBookingId },
          }
        );
        if (deleted > 0) {
          return resolve(
            new BaseSuccessResponse({
              message: "Từ chối thông tin tham gia thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Từ chối thông tin tham gia thất bại",
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

export default badmintonGatherBookingService;

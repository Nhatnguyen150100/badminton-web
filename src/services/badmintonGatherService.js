import { Op } from "sequelize";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseReponse";
import logger from "../config/winston";
import db from "../models";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import onRemoveParams from "../utils/remove-params";
import { DEFINE_STATUS } from "../constants/status";
import groupAndMerge from "../utils/group-item";

const badmintonGatherService = {
  createBadmintonGather: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId, scheduleId } = data;
        const created = await db.BadmintonGather.create(onRemoveParams(data));
        if (created) {
          return resolve(
            new BaseSuccessResponse({
              data: created,
              message: "Tạo lịch giao lưu thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Tạo lịch giao lưu thất bại",
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
  updateBadmintonGather: (id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updated = await db.BadmintonGather.update(data, {
          where: { id },
        });
        if (updated) {
          return resolve(
            new BaseSuccessResponse({
              message: "Cập nhật lịch giao lưu thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Cập nhật lịch giao lưu thất bại",
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
  deleteBadmintonGather: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleted = await db.BadmintonGather.destroy({ where: { id } });
        if (deleted) {
          return resolve(
            new BaseSuccessResponse({
              message: "Xóa lịch giao lưu thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Xóa lịch giao lưu thất bại",
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
  getListBadmintonGathersByUserId: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          userId,
        };
        if (nameLike) {
          query = {
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
        const result = await db.BadmintonGather.findAndCountAll(option);
        const list = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of courts retrieved successfully",
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
  getBadmintonGatherDetail: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.BadmintonGather.findAll({
          include: [
            {
              model: db.User,
              as: "user",
              required: true,
            },
            {
              model: db.BadmintonGatherComment,
              as: "badmintonGatherComments",
              required: false,
              order: [["order", "ASC"]],
              include: [{
                model: db.User,
                as: "user",
                required: true,
              }],
            },
          ],
          where: { id },
          nest: true,
          raw: true,
        });
        const groupedResults = groupAndMerge(
          result,
          "id",
          "badmintonGatherComments"
        );
        const finalResult = groupedResults[0];
        if (!result) {
          return reject(
            new BaseErrorResponse({
              message: "Lịch giao lưu không tồn tại",
            })
          );
        }
        return resolve(
          new BaseSuccessResponse({
            data: finalResult,
            message: "Detail of gather retrieved successfully",
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
  getListBadmintonGather: (data) => {
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
            order: [["createdAt", "DESC"]],
            raw: true,
            nest: true,
            distinct: true,
          },
          [0]
        );
        const result = await db.BadmintonGather.findAndCountAll(option);
        const court = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: court,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of courts retrieved successfully",
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

export default badmintonGatherService;

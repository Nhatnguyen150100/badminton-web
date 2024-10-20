import { DEFINE_STATUS } from "../constants/status";
import userBookingService from "../services/userBookingService";

const userBookingController = {
  getBookingsByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await userBookingService.getBookingsByUser(id, req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  getBookingsByBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await userBookingService.getBookingByBadmintonCourt(
        id,
        req.query
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createBooking: async (req, res) => {
    try {
      const { userId, scheduleId, note } = req.body;
      const rs = await userBookingService.createBooking(
        userId,
        scheduleId,
        note
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  changeAcceptUserBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, message } =
        await userBookingService.changeAcceptUserBooking(id);
      res.status(status).json({ message });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  deniedUserBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, message } = await userBookingService.deniedUserBooking(
        id
      );
      res.status(status).json({ message });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  // updateTimeBooking: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { startTime, endTime } = req.body;
  //     const rs = await timeBookingService.updateTimeBooking(
  //       id,
  //       startTime,
  //       endTime
  //     );
  //     res.status(rs.status).json(rs);
  //   } catch (error) {
  //     res.status(error.status).json(error);
  //   }
  // },
  // deleteTimeBooking: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { message } = await timeBookingService.deleteTimeBooking(id);
  //     res.status(200).json({ message });
  //   } catch (error) {
  //     res.status(error.status).json(error);
  //   }
  // },
};

export default userBookingController;

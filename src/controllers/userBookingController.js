import { DEFINE_STATUS } from "../constants/status";
import userBookingService from "../services/userBookingService";

const userBookingController = {
  getBookingsByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await userBookingService.getBookingsByUser(
        id,
        req.query
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  getBookingsByBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await userBookingService.getBookingByBadmintonCourt(
        id,
        req.query
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  createBooking: async (req, res) => {
    try {
      const { userId, scheduleId, note } = req.body;
      const { data, message } = await userBookingService.createBooking(
        userId,
        scheduleId,
        note
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  changeAcceptUserBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await userBookingService.changeAcceptUserBooking(
        id,
      );
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  cancelUserBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await userBookingService.cancelUserBooking(
        id,
      );
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  // updateTimeBooking: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { startTime, endTime } = req.body;
  //     const { data, message } = await timeBookingService.updateTimeBooking(
  //       id,
  //       startTime,
  //       endTime
  //     );
  //     res.status(200).json({ message, data });
  //   } catch (error) {
  //     res.status(error.status).json({ message: error.message });
  //   }
  // },
  // deleteTimeBooking: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { message } = await timeBookingService.deleteTimeBooking(id);
  //     res.status(200).json({ message });
  //   } catch (error) {
  //     res.status(error.status).json({ message: error.message });
  //   }
  // },
};

export default userBookingController;

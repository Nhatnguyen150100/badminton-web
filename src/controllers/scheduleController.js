import scheduleService from "../services/scheduleService";

const scheduleController = {
  getListSchedule: async (req, res) => {
    try {
      const { data, message } = await scheduleService.getListSchedule(
        req.query
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createSchedule: async (req, res) => {
    try {
      const {
        badmintonCourtId,
        courtNumberId,
        timeBookingId,
        appointmentDate,
        constBooking,
      } = req.body;
      if(!badmintonCourtId) {
        return res.status(400).json({ message: "badminton courtId is required" });
      }
      if(!courtNumberId) {
        return res.status(400).json({ message: "courtNumberId is required" });
      }
      if(!timeBookingId) {
        return res.status(400).json({ message: "timeBookingId is required" });
      }
      if(!appointmentDate) {
        return res.status(400).json({ message: "appointmentDate is required" });
      }
      if(!constBooking) {
        return res.status(400).json({ message: "constBooking is required" });
      }
      const { data, message } = await scheduleService.createSchedule(
        badmintonCourtId,
        courtNumberId,
        timeBookingId,
        appointmentDate,
        constBooking
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  updatedSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { courtNumberId, timeBookingId, appointmentDate, constBooking } =
        req.body;
      const { data, message } = await scheduleService.updatedSchedule(
        id,
        courtNumberId,
        timeBookingId,
        appointmentDate,
        constBooking
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error?.status ?? 500).json({ message: error.message });
    }
  },
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await scheduleService.deleteSchedule(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default scheduleController;

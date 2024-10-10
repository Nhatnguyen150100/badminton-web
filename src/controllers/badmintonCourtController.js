import badmintonCourtService from "../services/BadmintonCourtService";

const { DEFINE_STATUS } = require("../constants/status");

const badmintonCourtController = {
  getListBadmintonCourt: async (req, res) => {
    try {
      const { data, message } =
        await badmintonCourtService.getListBadmintonCourt(req.query);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  createBadmintonCourt: async (req, res) => {
    try {
      const { userId, ...resData } = req.body;
      const { data, message } =
        await badmintonCourtService.createBadmintonCourt(userId, resData);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  getBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await badmintonCourtService.getBadmintonCourt(
        id
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  updateBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await badmintonCourtService.updateBadmintonCourt(
        id,
        req.body
      );
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  changeStatusBadmintonCourt: async (req, res) => {
    try {
      const { status } = req.body;
      if (!Object.values(DEFINE_STATUS).includes(status)) {
        return res.status(400).json({
          message: `Invalid status, status include ${Object.values(
            DEFINE_STATUS
          ).join(" ,")}`,
        });
      }
      const { id } = req.params;
      const { data, message } =
        await badmintonCourtService.changeStatusBadmintonCourt(id, status);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
  deleteBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await badmintonCourtService.deleteBadmintonCourt(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
};

export default badmintonCourtController;

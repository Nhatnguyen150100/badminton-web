const { DEFINE_STATUS } = require("../constants/status");
const {
  default: badmintonCourtService,
} = require("../services/BadmintonCourtService");

const badmintonCourtController = {
  createBadmintonCourt: async (req, res) => {
    try {
      const { userId, ...res } = req.body;
      const { data, message } =
        await badmintonCourtService.createBadmintonCourt(userId, res);
      res.status(201).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  getBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await badmintonCourtService.getBadmintonCourt(
        id
      );
      res.status(201).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  updateBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } =
        await badmintonCourtService.updateBadmintonCourt(id, req.body);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  changeStatusBadmintonCourt: async (req, res) => {
    try {
      const { status } = req.body;
      if (!Object.values(DEFINE_STATUS).includes(status)) {
        return res
          .status(400)
          .json({
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
      res.status(500).json({ message: "server error" });
    }
  },
  deleteBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await badmintonCourtService.deleteBadmintonCourt(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};

export default badmintonCourtController;

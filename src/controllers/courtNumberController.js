import courtNumberService from "../services/courtNumberService";

const courtNumberController = {
  getListCourtNumbers: async (req, res) => {
    try {
      const { data, message } = await courtNumberService.getListCourtNumber(
        req.query
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  createCourtNumber: async (req, res) => {
    try {
      const { badmintonCourtId, name } = req.body;
      const { data, message } = await courtNumberService.createCourtNumber(
        badmintonCourtId,
        name
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  getCourtNumber: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await courtNumberService.getCourtNumber(id);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  updateCourtNumber: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const { data, message } = await courtNumberService.updateCourtNumber(
        id,
        name
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
  deleteCourtNumber: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await courtNumberService.deleteCourtNumber(id);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};

export default courtNumberController;

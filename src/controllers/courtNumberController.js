import courtNumberService from "../services/courtNumberService";

const courtNumberController = {
  getListCourtNumbers: async (req, res) => {
    try {
      const { data, message } = await courtNumberService.getListCourtNumber(
        req.query
      );
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
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
      res.status(error.status).json({ message: error.message });
    }
  },
  getCourtNumber: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await courtNumberService.getCourtNumber(id);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
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
      res.status(error.status).json({ message: error.message });
    }
  },
  deleteCourtNumber: async (req, res) => {
    try {
      const { id } = req.params;
      const { data, message } = await courtNumberService.deleteCourtNumber(id);
      res.status(200).json({ message, data });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },
};

export default courtNumberController;

"use-strict";
import authService from "../services/auth/authService";

const authMiddleware = {
  checkUserExist: async (req, res, next) => {
    try {
      const { email } = req.body;
      const { data, message } = await authService.checkUserExists(email);
      if (data) {
        return res.status(400).json({ message });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  },
};

export default authMiddleware;

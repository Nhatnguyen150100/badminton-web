import logger from "../config/winston";
import profileService from "../services/profileService";

const profileController = {
  updateProfile: async (req, res) => {
    try {
      const avatar = req.avatar;
      const { id } = req.params;
      const { fullName, gender, phoneNumber, accountBalance } = req.body;
      const { data, message } = await profileService.updateProfile(
        id,
        fullName,
        gender,
        avatar,
        phoneNumber,
        accountBalance
      );
      if (!data) {
        return res.status(400).json({ message });
      }
      res.status(200).json({ data, message });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "server error" });
    }
  },
};

export default profileController;

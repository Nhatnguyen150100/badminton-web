'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserBooking.belongsTo(models.Schedule, {
        foreignKey: { name: "scheduleId", allowNull: false },
        targetKey: "id",
      });
      UserBooking.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        targetKey: "id",
      });
    }
  }
  UserBooking.init({
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    scheduleId: DataTypes.UUID,
    userId: DataTypes.UUID,
    note: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserBooking',
  });
  return UserBooking;
};
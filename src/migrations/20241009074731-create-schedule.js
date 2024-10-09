"use strict";

const { DEFINE_SCHEDULE_STATUS } = require('../constants/status');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      badmintonCourtId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "BadmintonCourts",
            name: "badmintonCourtId",
          },
          key: "id",
        },
      },
      courtNumberId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "CourtNumbers",
            name: "courtNumberId",
          },
          key: "id",
        },
      },
      timeBookingId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "TimeBookings",
            name: "timeBookingId",
          },
          key: "id",
        },
      },
      appointmentDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      const: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: DEFINE_SCHEDULE_STATUS.AVAILABLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Schedules");
  },
};

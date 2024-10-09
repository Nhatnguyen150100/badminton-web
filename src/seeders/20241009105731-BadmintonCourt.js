"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "BadmintonCourts",
      [
        {
          id: "bf08afd0-111a-47c8-99db-2b2699055dde",
          userId: "d511aeab-f46d-408c-a29d-55ad1855651a",
          name: "Sân cầu lông ABC",
          district: "Quận Hoàng mai",
          ward: "Phường Hoàng mai",
          address: "123 Đường XYZ, Quận 1, TP.HCM",
          lang: 10.762622,
          lat: 10.762622,
          imageCourt: "123e4567-e89b-12d3-a456-426614174001",
          description: "Sân cầu lông rộng rãi, đầy đủ tiện nghi và ánh sáng.",
          status: "PENDING_APPROVAL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("BadmintonCourts", null, {});
  },
};

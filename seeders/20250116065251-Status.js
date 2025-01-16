'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('status', [
      { name: 'Terkirim', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Diterima', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ditolak', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('status', null, {});
  }
};

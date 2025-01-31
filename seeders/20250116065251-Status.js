'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('status', [
      { name: 'Diproses', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Diterima', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Surat Pernyataan', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mulai Magang', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ditolak', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Menolak', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('status', null, {});
  }
};

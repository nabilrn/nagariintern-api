'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { name: 'User', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'SuperAdmin', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};

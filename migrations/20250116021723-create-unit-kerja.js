'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('unit_kerja', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      kuotaMhs: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kuotaSiswa: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tipe_cabang: {
        type: Sequelize.ENUM('pusat', 'utama', 'a', 'b', 'c'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('unit_kerja');
  }
};
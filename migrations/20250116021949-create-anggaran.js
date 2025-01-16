'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('anggaran', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      unitKerjaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'unit_kerja',
          key: 'id'
        }
      },
      bulan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalAnggaran: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sisaAnggaran: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('anggaran');
  }
};
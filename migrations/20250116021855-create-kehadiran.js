'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kehadiran', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pesertamagangId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permintaan',
          key: 'id'
        }
      },
      bulan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      totalKehadiran: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      biaya: {
        type: Sequelize.INTEGER,
        defaultValue: 19000,
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
    await queryInterface.dropTable('kehadiran');
  }
};
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
        },
        onDelete: 'CASCADE'
      },
      totalKehadiran: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_biaya: {
        type: Sequelize.INTEGER,
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

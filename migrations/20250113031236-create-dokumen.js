'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dokumen', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      permintaanMagangId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permintaan_magang',
          key: 'id'
        }
      },
      tipeDokumen: {
        type: Sequelize.ENUM('cv', 'transkip nilai', 'ktp', 'suratPengantar', 'suratBalasan', 'surat tugas'),
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('dokumen');
  }
};
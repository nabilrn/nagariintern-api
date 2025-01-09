'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('surat_balasan', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      permintaanMagangId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permintaan_magang',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nomor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lampiran: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      perihal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      asalInstansi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      daftarMagang: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('surat_balasan');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permintaan_magang', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nama tabel User
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tipePemohon: {
        type: Sequelize.ENUM('siswa', 'mahasiswa'),
        allowNull: false,
      },
      institusi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jurusan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      statusPermohonan: {
        type: Sequelize.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      fileLamaran: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tanggalPengajuan: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      statusPersetujuanPSDM: {
        type: Sequelize.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      waktuPersetujuanPSDM: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      statusPersetujuanPimpinan: {
        type: Sequelize.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      waktuPersetujuanPimpinan: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('permintaan_magang');
  },
};

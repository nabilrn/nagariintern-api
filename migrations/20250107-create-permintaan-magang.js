'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permintaan_magang', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
        allowNull: false,
        defaultValue: 'menunggu',
      },
      fileLamaran: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tanggalPengajuan: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus tabel dan ENUM
    await queryInterface.dropTable('permintaan_magang');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_permintaan_magang_tipePemohon";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_permintaan_magang_statusPermohonan";');
  },
};

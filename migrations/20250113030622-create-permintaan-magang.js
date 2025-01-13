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
      institusiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'institusi', // Nama tabel Institusi
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      jurusanId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'jurusan', // Nama tabel Jurusan
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      noHp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      statusPermohonan: {
        type: Sequelize.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      tanggalPengajuan: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      tanggalMulai: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tanggalSelesai: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      divisiId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'divisi', // Nama tabel Departemen
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
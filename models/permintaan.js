'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PermintaanMagang extends Model {
    static associate(models) {
      // Relasi ke tabel User
      PermintaanMagang.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Alias untuk relasi
      });
    }
  }

  PermintaanMagang.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nama tabel User
          key: 'id',
        },
      },
      tipePemohon: {
        type: DataTypes.ENUM('siswa', 'mahasiswa'),
        allowNull: false,
      },
      institusi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jurusan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      statusPermohonan: {
        type: DataTypes.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      fileLamaran: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tanggalPengajuan: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      statusPersetujuanPSDM: {
        type: DataTypes.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      waktuPersetujuanPSDM: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      statusPersetujuanPimpinan: {
        type: DataTypes.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      waktuPersetujuanPimpinan: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PermintaanMagang',
      tableName: 'permintaan_magang',
      timestamps: true,
    }
  );

  return PermintaanMagang;
};

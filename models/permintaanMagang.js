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
      PermintaanMagang.belongsTo(models.Institusi, { foreignKey: 'institusiId' });
      PermintaanMagang.belongsTo(models.Divisi, { foreignKey: 'divisiId' });
      PermintaanMagang.belongsTo(models.Jurusan, { foreignKey: 'jurusanId' });
      PermintaanMagang.hasMany(models.Dokumen, { foreignKey: 'permintaanMagangId' });
      PermintaanMagang.hasMany(models.SuratBalasan, { foreignKey: 'permintaanMagangId' });
      
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
      institusiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'institusi', // Nama tabel Institusi
          key: 'id',
        },
      },
      jurusanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'jurusan', // Nama tabel Jurusan
          key: 'id',
        },
      },
      
      alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      noHp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      statusPermohonan: {
        type: DataTypes.ENUM('menunggu', 'disetujui', 'ditolak'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      
      tanggalPengajuan: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      tanggalMulai: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      tanggalSelesai: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      divisiId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'divisi', // Nama tabel Departemen
          key: 'id',
        },
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

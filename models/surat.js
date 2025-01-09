'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SuratBalasan extends Model {
    static associate(models) {
      // Relasi ke tabel PermintaanMagang
      SuratBalasan.belongsTo(models.PermintaanMagang, {
        foreignKey: 'permintaanMagangId',
        as: 'permintaanMagang',
      });
    }
  }

  SuratBalasan.init(
    {
      permintaanMagangId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'permintaan_magang',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nomor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lampiran: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      perihal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      asalInstansi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      daftarMagang: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SuratBalasan',
      tableName: 'surat_balasan',
      timestamps: true,
    }
  );

  return SuratBalasan;
};

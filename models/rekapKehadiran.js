"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RekapKehadiran extends Model {
    static associate(models) {
      RekapKehadiran.belongsTo(models.Karyawan, {
        foreignKey: "karyawanId",
        as: "karyawan",
        onDelete: "CASCADE",
      });
    }
  }

  RekapKehadiran.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      karyawanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Karyawan",
          key: "id",
        },
      },
      tahun: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bulan: {
        type: DataTypes.ENUM(
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember"
        ),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RekapKehadiran",
      tableName: "rekap_kehadiran",
      timestamps: true,
    }
  );

  return RekapKehadiran;
};

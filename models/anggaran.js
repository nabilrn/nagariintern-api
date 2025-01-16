'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Anggaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Anggaran.belongsTo(models.UnitKerja, {
        foreignKey: 'unitKerjaId',
        as: 'unitKerja',
        onDelete: 'CASCADE',
      });
    }
  }
  Anggaran.init({
    unitKerjaId: {
      type : DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'UnitKerja',
        key: 'id'
      }
    },
    bulan : {
      type : DataTypes.STRING,
      allowNull: false,
    },
    totalAnggaran : {
      type : DataTypes.INTEGER,
      allowNull: false,
    },
    sisaAnggaran : {
      type : DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'Anggaran',
    tableName : 'anggaran',
    timestamps: true,
  });
  return Anggaran;
};
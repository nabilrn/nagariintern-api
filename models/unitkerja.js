'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UnitKerja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UnitKerja.hasMany(models.Permintaan , { foreignKey : 'unitKerjaId'  });
      UnitKerja.hasMany(models.Anggaran , { foreignKey : 'unitKerjaId'  });
    }
  }
  UnitKerja.init({
    name: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    kuotaMhs: {
      type : DataTypes.INTEGER,
      allowNull: false,
    },
    kuotaSiswa: {
      type : DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UnitKerja',
    tableName : 'unit_kerja',
    timestamps: true,
  });
  return UnitKerja;
};
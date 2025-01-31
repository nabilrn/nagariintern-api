'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jadwal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Jadwal.hasMany(models.Permintaan, { foreignKey: 'jadwalId' });
      
    }
  }
  Jadwal.init({
    nama:{ 
      type :DataTypes.STRING,
      allowNull:false
    },
    tanggalMulai: {
      type: DataTypes.DATE,
      allowNull:false
    },
    tanggalSelesai: {
      type: DataTypes.DATE,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Jadwal',
    tableName: 'jadwal',
    timestamps: true
  });
  return Jadwal;
};
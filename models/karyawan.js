'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Karyawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Karyawan.belongsTo(models.UnitKerja, { foreignKey: 'unitKerjaId' });
      Karyawan.belongsTo(models.Users, { foreignKey: 'userId' });
    }
  }
  Karyawan.init({
    nama: 
    {
      type :DataTypes.STRING,
      allowNull:true
    },
    nik: 
    {
      type :DataTypes.STRING,
      allowNull:true
    },
    nomorHp: 
    {
      type :DataTypes.STRING,
      allowNull:true
    },
    jabatan: 
    {
      type :DataTypes.STRING,
      allowNull:true
    },
    unitKerjaId: 
    {
      type :DataTypes.INTEGER,
      allowNull:true,
      references: {
        model: 'UnitKerja',
        key: 'id'
      }
    },
    userId: 
    {
      type :DataTypes.INTEGER,
      allowNull:true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'Karyawan',
    tableName: 'karyawan',
    timestamps: true
  });
  return Karyawan;
};
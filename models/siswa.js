'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Siswa extends Model {
    static associate(models) {
      Siswa.belongsTo(models.Users, { foreignKey: 'userId' });
    }
  }
  Siswa.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nisn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_hp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rekening: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Siswa',
    tableName: 'siswa',
    timestamps: true,
  });
  return Siswa;
};
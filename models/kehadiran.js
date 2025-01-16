'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kehadiran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Kehadiran.belongsTo(models.Permintaan, { foreignKey: 'pesertamagangId', as: 'pesertamagang' , onDelete: 'CASCADE' });
    }
  }
  Kehadiran.init({
    pesertamagangId: {
      type : DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permintaan',
        key: 'id'
      }
    },
    bulan: {
      type : DataTypes.STRING,
      allowNull: true,
    },
    totalKehadiran: {
      type : DataTypes.INTEGER,
      allowNull: true,
    },
    biaya: {
      type : DataTypes.INTEGER, defaultValue: 19000,
      allowNull: true,

    },

  }, {
    sequelize,
    modelName: 'Kehadiran',
    tableName : 'kehadiran',
    timestamps: true,
  });
  return Kehadiran;
};
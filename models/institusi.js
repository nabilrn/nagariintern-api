'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Institusi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Institusi.hasMany(models.Jurusan, { foreignKey: 'institusiId' });
      Institusi.hasMany(models.PermintaanMagang, { foreignKey: 'institusiId' });
    }
  }
  Institusi.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Institusi',
    tableName: 'institusi',
    timestamps: false,
  });
  return Institusi;
};
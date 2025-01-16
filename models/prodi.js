'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prodi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Prodi.hasMany(models.Permintaan , { foreignKey : 'prodiId'  });
    }
  }
  Prodi.init({
    name: {
      type : DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Prodi',
    tableName : 'prodi',
    timestamps: true,
  });
  return Prodi;
};
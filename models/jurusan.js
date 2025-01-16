'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jurusan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Jurusan.hasMany(models.Permintaan , { foreignKey : 'jurusanId'  });
    }
  }
  Jurusan.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Jurusan',
    tableName : 'jurusan',
    timestamps : true
  });
  return Jurusan;
};
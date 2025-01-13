'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SuratBalasan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SuratBalasan.belongsTo(models.PermintaanMagang, { foreignKey: 'permintaanMagangId' });
    }
  }
  SuratBalasan.init({
    permintaanMagangId :{
      type : DataTypes.STRING,
      allowNull : false,
      references : {
        model : 'PermintaanMagang',
        key : 'id'
      }
    },
    nomorSurat: {
      type : DataTypes.STRING,
      allowNull : false
    },
  }, {
    sequelize,
    modelName: 'SuratBalasan',
    tableName : 'suratBalasan',
    timestamps : true
  });
  return SuratBalasan;
};
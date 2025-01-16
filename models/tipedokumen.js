'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipeDokumen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TipeDokumen.hasMany(models.Dokumen , { foreignKey : 'tipeDokumenId'  });

    }
  }
  TipeDokumen.init({
    name: {
      type : DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'TipeDokumen',
    tableName : 'tipe_dokumen',
    timestamps: true,
  });
  return TipeDokumen;
};
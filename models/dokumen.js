'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dokumen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Dokumen.belongsTo(models.Permintaan, {
        foreignKey : 'permintaanId', as : 'permintaan', onDelete : 'CASCADE'  
      });
      Dokumen.belongsTo(models.TipeDokumen, {
        foreignKey : 'tipeDokumenId', as : 'tipeDokumen', onDelete : 'CASCADE'  
      });
    }
  }
  Dokumen.init({
    permintaanId : {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model : 'Permintaan',
        key : 'id'
      },
      
    },
    tipeDokumenId : {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model : 'TipeDokumen',
        key : 'id'
      },
    },
    url : {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Dokumen',
    tableName : 'dokumen',
    timestamps: true
  });
  return Dokumen;
};
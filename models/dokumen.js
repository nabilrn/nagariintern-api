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
      
      Dokumen.belongsTo(models.PermintaanMagang, { foreignKey: 'permintaanMagangId' });
    }
  }
  Dokumen.init({
    
    permintaanMagangId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      references : {
        model : 'PermintaanMagang',
        key : 'id'
      }

    },
    tipeDokumen: {
      type : DataTypes.ENUM('cv', 'transkip nilai', 'ktp', 'suratPengantar', 'suratBalasan', 'surat tugas'),
      allowNull : false
    },
    url: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Dokumen',
    tableName : 'dokumen',
    timestamps : true

  });
  return Dokumen;
};
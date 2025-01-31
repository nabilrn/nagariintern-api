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
    
    totalKehadiran: {
      type : DataTypes.INTEGER,
      allowNull: true,
    },
    total_biaya: {
      type : DataTypes.INTEGER,
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
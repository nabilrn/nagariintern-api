'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Smk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Smk.hasMany(models.Permintaan , { foreignKey : 'smkId'  });
    }
  }
  Smk.init({
    name: {
      type : DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Smk',
    tableName : 'smk',
    timestamps: true,
  });
  return Smk;
};
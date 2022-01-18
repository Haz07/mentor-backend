'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      return { ...this.get(), id: undefined, hash: undefined, salt: undefined };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        unique: true,
      },
      hash: { type: DataTypes.STRING, allowNull: true },
      salt: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};

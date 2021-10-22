const sequelize = require("../util/posgre-database");
const { DataTypes } = require("sequelize");
const {AccountTypeModel} = require('./account-type')

const AccountModel = sequelize.define(
  "cuenta",
  {
    // Model attributes are defined here
    cuenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "olme59",
    },
    add_fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    saldo: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Account = {};

Account.create = ({ descripcion, cuenta_tipo, moneda, usuario }) => {
  return AccountModel.create({
    descripcion,
    cuenta_tipo,
    moneda,
    usuario,
    add_fecha: new Date(),
  });
};

Account.deduceFromWallet = (walletId, amount) =>{
  return AccountModel.increment('saldo', { 
    by: -amount, 
    where: {
      cuenta:walletId
    }
  });
}

Account.findAccountsByUser = (userName) => {
  return AccountModel.findAll({
    where:{
      usuario:userName
    }
  })
};

Account.fetchAll = () => {
  return AccountModel.findAll({
    include:["CuentaTypoObj","MonedaObj"]
  });
};

module.exports = {
  Account,
  AccountModel
};

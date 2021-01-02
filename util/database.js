const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-book-shop", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;

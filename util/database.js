const Sequelize = require("sequelize");

const sequelize = Sequelize("node-book-shop", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;

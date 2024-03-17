var mysql2 = require("mysql2");
var db = require("mysql-promise")();

const pool = mysql2.createPool({
  user: "root",
  password: "",
  database: "testdb",
  host: "localhost",
});

module.exports = pool;

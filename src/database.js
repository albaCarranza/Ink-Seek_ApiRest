const mysql = require("mysql2/promise");

const Pool = mysql.createPool({
  host: "ink-seek.c9xn6kahrfek.eu-west-3.rds.amazonaws.com",
  user: "admin",
  password: "administrador",
  database: "in-seek",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0
});

console.log("Conexión con la base de datos creada");

module.exports = {Pool};
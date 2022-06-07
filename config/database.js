const dotenv = require("dotenv");
dotenv.config();

const config = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "admin",
  database: process.env.DB_NAME || "users_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

module.exports = config;

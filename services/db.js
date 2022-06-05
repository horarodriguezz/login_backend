const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

const query = async (query, values) => {
  try {
    const [results] = await promisePool.query(query, values);

    return results;
  } catch (error) {
    console.log(error);
  }
};

const execute = async (query, values) => {
  try {
    const [ResultSetHeader] = await promisePool.query(query, values);

    return ResultSetHeader;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { query, execute };

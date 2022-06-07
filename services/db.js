const mysql = require("mysql2");

const config = require("../config/database");

const pool = mysql.createPool(config);

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

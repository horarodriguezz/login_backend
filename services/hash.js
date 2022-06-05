const bcrypt = require("bcrypt");

const createHash = async (password) => {
  try {
    const hashPassword = bcrypt.hash(password, 10);

    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};

const compareWithHash = async (password, hash) => {
  try {
    const result = await bcrypt.compare(password, hash);

    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createHash, compareWithHash };

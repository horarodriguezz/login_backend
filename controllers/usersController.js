const { query } = require("../services/db");

const getUser = async (req, res, next) => {
  try {
    const id = req.id;
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    const values = [id];

    const results = await query(sql, values);
    if (!results || results.length === 0)
      return res.status(404).json({ message: "The user was not found." });
    const user = results[0];

    if (!user)
      return res.status(404).json({ message: "The user was not found." });

    const userData = {
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
    };

    return res.status(200).json({
      ...userData,
      token: req.token,
      refreshToken: req.headers.refresh,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUser };

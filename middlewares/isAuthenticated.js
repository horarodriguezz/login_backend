const { sign, verify } = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ mesage: "Unauthorized" });
    const accessToken = req.headers.authorization.split(" ")[1];
    const token = verify(accessToken, process.env.JWT_SECRET);

    let newAccessToken;
    if (req.headers.refresh) {
      const refreshToken = verify(
        req.headers.refresh,
        process.env.JWT_REFRESH_SECRET
      );

      const { iat, exp, ...oldAccessToken } = token;
      if (token.user_id === refreshToken.user_id)
        newAccessToken = sign(oldAccessToken, process.env.JWT_SECRET, {
          expiresIn: "30m",
        });
    }

    res.json({ token: newAccessToken, refreshToken: req.headers.refresh });

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = isAuthenticated;

const speakeasy = require("speakeasy");

const generateUserSecret = () => {
  const { base32 } = speakeasy.generateSecret({});

  return base32;
};

const generateOtpUrl = (secret, label = "Test App") => {
  const url = `otpauth://totp/${label}?secret=${secret}`;

  return url;
};

const verifyCode = (secret, code) => {
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: code,
  });

  return verified;
};

module.exports = {
  generateUserSecret,
  generateOtpUrl,
  verifyCode,
};

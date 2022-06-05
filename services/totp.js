const speakeasy = require("speakeasy");

const generateUserSecret = () => {
  const { base32 } = speakeasy.generateSecret({});
  console.log(base32);
  return base32;
};

const generateOtpUrl = (secret, label = "Test App") => {
  console.log(secret);
  const url = `otpauth://totp/${label}?secret=${secret}`;
  console.log(url);
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

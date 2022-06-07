const dotenv = require("dotenv");
dotenv.config();

const config = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE || false,
  pool: process.env.MAILER_POOL || false,
  auth: {
    user: process.env.MAIL_USER, //required via .env
    pass: process.env.APP_PASSWORD, //if gmail it's a generated app password, if not it could be the email pass.
  },
};

module.exports = config;

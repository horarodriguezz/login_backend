const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE || false,
  pool: process.env.MAILER_POOL || false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      partialsDir: path.resolve("./views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views/"),
  })
);

const sendConfirmationEmail = async (email, name, lastName, url) => {
  try {
    const info = transporter.sendMail({
      to: email,
      subject: `${process.env.APP_NAME} - Email validation`,
      text: `Hello this ${name} ${lastName}, thanks for the registration! To activate your account click on the next link: ${url}`,
      template: "confirmation",
      context: {
        app: process.env.APP_NAME || "Test app",
        name,
        lastName,
        url,
      },
    });

    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendConfirmationEmail };

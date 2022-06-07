const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const config = require("../config/mailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport(config);

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

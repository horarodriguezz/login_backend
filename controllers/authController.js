const { createHash, compareWithHash } = require("../services/hash");
const { sendConfirmationEmail } = require("../services/mailer");
const { sign } = require("jsonwebtoken");
const { query, execute } = require("../services/db");
const {
  generateUserSecret,
  generateOtpUrl,
  verifyCode,
} = require("../services/totp");

const register = async (req) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let sql;
    let values;

    //Check if user exists
    sql = "SELECT * FROM users WHERE email = ?";
    values = [email];
    const exists = await query(sql, values);
    if (exists?.length > 0)
      return { status: 400, message: "Email already in use." };

    //if not exists create the user
    const pass = await createHash(password);
    const secret = generateUserSecret();
    sql =
      "INSERT INTO users (firstname, lastname, email, user_password, confirmed_email, first_login, tfa_secret) VALUES (?,?,?,?,?,?,?)";
    values = [firstName, lastName, email, pass, false, true, secret];
    const { insertId } = await execute(sql, values);

    //query the user to verify that is already in DB and use his data to send the validation email.
    sql = "SELECT * FROM users WHERE user_id = ?";
    values = [insertId];
    const response = await query(sql, values);
    if (response.length === 0)
      return {
        status: 500,
        message: "An error ocurred while creating the account.",
      };

    const user = response[0];
    const token = sign(
      { user_id: user.user_id },
      process.env.MAIL_CONFIRMATION_SECRET,
      { expiresIn: "4h" }
    );
    const url = `${req.protocol}://${req.get(
      "host"
    )}/auth/confirmation/${token}`;

    const { messageId, rejected } = await sendConfirmationEmail(
      user.email,
      user.firstname,
      user.lastname,
      url
    );

    if (!messageId || rejected.length > 0)
      return {
        status: 500,
        message: "An error ocurred sending the validation email.",
      };

    return {
      status: 201,
      message:
        "Account created. One more step: please check your email for confirmation.",
    };
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const confirmateEmail = async (id) => {
  try {
    const sql = "UPDATE users SET confirmed_email = true WHERE user_id = ?";
    const values = [id];

    const response = await execute(sql, values);
    return response;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const authenticate = async (email, password) => {
  let sql;
  let values;
  try {
    //Check if user email exists
    sql = "SELECT * FROM users WHERE email = ?";
    values = [email];
    const response = await query(sql, values);
    const user = response[0];
    if (!user) return { status: 400, json: { message: "Email not found." } };

    //if exists, check if it's validated
    const validated = user.confirmed_email;

    if (!validated) {
      const token = sign(
        { user_id: user.user_id },
        process.env.MAIL_CONFIRMATION_SECRET,
        { expiresIn: "4h" }
      );
      const { messageId, rejected } = await sendConfirmationEmail(
        user.email,
        user.firstname,
        user.lastname,
        token
      );

      if (!messageId || rejected.length > 0)
        return {
          status: 500,
          json: {
            message: "An error ocurred while sending the validation email.",
          },
        };

      return {
        status: 401,
        json: {
          message:
            "User email was not verified, we just send an email for confirmation, please check your inbox.",
        },
      };
    }

    //if exists and it's validated, check if password is valid

    const match = await compareWithHash(password, user.user_password);
    if (!match)
      return { status: 400, json: { message: "Incorrect password." } };

    let token;

    if (user.first_login) {
      const otpauthUrl = generateOtpUrl(user.tfa_secret, process.env.APP_NAME);
      token = sign({ id: user.user_id }, process.env.TFA_SECRET, {
        expiresIn: "10m",
      });
      return {
        status: 202,
        json: {
          message:
            "Please, register your account in your Microsoft Authenticator App",
          otpauthUrl,
          token,
        },
      };
    }

    token = sign({ id: user.user_id }, process.env.TFA_SECRET, {
      expiresIn: "10m",
    });

    return {
      status: 200,
      json: {
        message:
          "Please, insert the 6 digits code, you can get it from Microsoft Authenticator App.",
        token,
      },
    };
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const confirmOTP = async (id, code) => {
  try {
    let sql = "SELECT * FROM users WHERE user_id = ?";
    let values = [id];
    const response = await query(sql, values);
    if (!response || !response[0])
      return {
        status: 500,
        json: { message: "An error ocurred while validating the code." },
      };
    const user = response[0];

    const verified = verifyCode(user.tfa_secret, code);

    if (!verified)
      return {
        status: 400,
        json: {
          message: "Invalid code. Please try again.",
        },
      };

    if (user.first_login) {
      try {
        sql = "UPDATE users SET first_login = ? WHERE user_id = ?";
        values = [false, user.user_id];
        await execute(sql, values);
      } catch (error) {
        console.log(error);
      }
    }

    const {
      user_password,
      confirmed_email,
      first_login,
      tfa_secret,
      ...userData
    } = user;

    const token = sign(userData, process.env.JWT_SECRET, { expiresIn: "30m" });
    const refreshToken = sign(
      { user_id: user.user_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: 86400 }
    );

    return {
      status: 200,
      json: {
        token,
        refreshToken,
      },
    };
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { register, confirmateEmail, authenticate, confirmOTP };

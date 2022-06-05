const express = require("express");
const {
  register,
  confirmateEmail,
  authenticate,
  confirmOTP,
} = require("../controllers/authController");
const { verify } = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    if (!req.body.firstName) res.status(400).send("First name is required.");
    if (!req.body.lastName) res.status(400).send("Last name is required.");
    if (!req.body.email) res.status(400).send("Email is required.");
    if (!req.body.password) res.status(400).send("Password is required.");

    const response = await register(req);

    res.status(response.status).send(response.message);
  } catch (error) {
    res.status(500).send(error.message);
    process.exit(1);
  }
});

router.post("/login", async (req, res) => {
  if (!req.body.email) res.status(400).send("Email is required.");
  if (!req.body.password) res.status(400).send("Password is required.");

  try {
    const response = await authenticate(req.body.email, req.body.password);

    res.status(response.status).json(response.json);
  } catch (error) {
    res.status(500).send(error.message);
    process.exit(1);
  }
});

router.post("/login/second-step", async (req, res) => {
  try {
    if (!req.headers.authorization)
      res.status(401).json({ status: "Unauthorized" });
    if (!req.body || !req.body.code)
      res.status(400).json({ message: "A 6 digits code is required." });

    const token = req.headers.authorization.split(" ")[1];
    const isValid = verify(token, process.env.TFA_SECRET);

    if (!isValid) res.status(400).json({ message: "invalid token." });
    const { id } = isValid;

    const response = await confirmOTP(id, req.body.code);

    res.status(response.status).json(response.json);
  } catch (error) {
    res.status(500).json({ message: error.message });
    process.exit(1);
  }
});

router.get("/confirmation/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const isValid = verify(token, process.env.MAIL_CONFIRMATION_SECRET);
    if (!isValid) res.status(400).json({ message: "Invalid token." });

    const response = await confirmateEmail(isValid.user_id);
    if (!response)
      res
        .status(500)
        .json({ message: "An error ocurred while validating the email." });
    if (response.affectedRows === 0)
      res.status(400).json({
        message: "An error ocurred while validating the email: no matching id.",
      });
    res.status(200).json({ status: "validated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    process.exit(1);
  }
});

module.exports = router;

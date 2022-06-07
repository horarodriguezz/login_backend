const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { getUser } = require("../controllers/usersController");

const router = express.Router();

router.get("/get-user", isAuthenticated, getUser);

module.exports = router;

const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.get("/private", isAuthenticated, async (req, res) => {
  return res.status(200);
});

module.exports = router;

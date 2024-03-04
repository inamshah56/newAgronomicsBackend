const jwt = require("jsonwebtoken");
const config = require("../../config/user/user.config");

function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "120d",
  });
}

module.exports = { generateAccessToken, generateRefreshToken };

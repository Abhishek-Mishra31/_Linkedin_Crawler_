const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

const generateToken = async (userData) => {
  return jwt.sign(userData, secret_key);
};

module.exports = { generateToken };

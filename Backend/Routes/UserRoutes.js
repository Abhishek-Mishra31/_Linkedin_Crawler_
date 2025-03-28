const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const { generateToken } = require("../Middleware/JwtAuthentication");

router.get("/", (req, res) => {
  res.send("User route is working");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    let success = false;
    let userData = new User(req.body);
    let response = await userData.save();

    const payload = {
      id: response.id,
    };

    const token = await generateToken(payload);
    success = true;
    res.json({ success: success, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    let success = false;
    const { email, password } = req.body;
    // find the user by its email
    const user = await User.findOne({ email: email });
    // if user is not available or entered password is not match by user's password -- return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Incorrect Username or Password" });
    }

    // generate the token
    const payload = {
      id: user.id,
    };
    let token = await generateToken(payload);
    success = true;
    res.json({ success: success, user: user, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;

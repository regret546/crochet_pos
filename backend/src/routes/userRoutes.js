const express = require("express");
const router = express.Router();
const User = require("../models/Users");

// @desc   Admin login
// @route  POST /api/users/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // simple (no hash yet)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successfull", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { loginUser, registerUser, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/reset-password", protect, resetPassword);

module.exports = router;

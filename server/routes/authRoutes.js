const express = require("express");
const router = express.Router();

const {
  registerUser,
  getAllUsers,
  loginUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const validateLogin = require("../middleware/validateLogin");

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", validateLogin, loginUser);

// Get All Users
router.get("/users", getAllUsers);

router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome! You have accessed a protected route.",
    user: req.user,
  });
});

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  addCrop,
  getAllCrops,
  getMyCrops,
  updateCrop,
  deleteCrop,
  getSingleCrop,
} = require("../controllers/cropController");

const authMiddleware = require("../middleware/authMiddleware");
const validateCrop = require("../middleware/validateCrop");
const upload = require("../middleware/upload");

// Public
router.get("/", getAllCrops);

// Protected
router.get("/my", authMiddleware, getMyCrops);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validateCrop,
  addCrop
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  validateCrop,
  updateCrop
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCrop
);

// KEEP LAST
router.get("/:id", getSingleCrop);

module.exports = router;
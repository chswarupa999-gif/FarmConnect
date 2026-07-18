const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateOrder = require("../middleware/validateOrder");
const validateOrderStatus = require("../middleware/validateOrderStatus");

const {
  placeOrder,
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  completeOrder,
  testRazorpay,
} = require("../controllers/orderController");

// ---------------- Dealer ----------------

// Create Order Request (PENDING)
router.post(
  "/",
  authMiddleware,
  validateOrder,
  placeOrder
);

// Dealer Orders
router.get(
  "/my",
  authMiddleware,
  getMyOrders
);

// Create Razorpay Order (ONLY AFTER ACCEPTED)
router.post(
  "/create-payment-order",
  authMiddleware,
  createRazorpayOrder
);

// Verify Payment
router.post(
  "/verify-payment",
  authMiddleware,
  verifyPayment
);

// ---------------- Farmer ----------------

// Farmer Orders
router.get(
  "/farmer",
  authMiddleware,
  getFarmerOrders
);

// Accept / Reject
router.put(
  "/:id/status",
  authMiddleware,
  validateOrderStatus,
  updateOrderStatus
);

// Dealer completes order
router.put(
  "/:id/complete",
  authMiddleware,
  completeOrder
);

// Test
router.get(
  "/test-payment",
  testRazorpay
);

module.exports = router;
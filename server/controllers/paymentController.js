const crypto = require("crypto");
const prisma = require("../config/prisma");
const razorpay = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    
    // Only the buyer can make payment for this order
    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this order",
      });
    }

    // Farmer must accept before payment
    if (order.status !== "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message: "Order is not accepted yet",
      });
    }

    const options = {
      amount: Math.round(order.totalPrice * 100), // paise
      currency: "INR",
      receipt: order.id,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrder,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Create expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    // Compare signatures
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Get Razorpay Order Details
    const razorpayOrder = await razorpay.orders.fetch(
      razorpay_order_id
    );

    // Receipt contains our database Order ID
    const orderId = razorpayOrder.receipt;

    // Update Order Status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "COMPLETED",

        paymentId: razorpay_payment_id,

        paymentStatus: "PAID",
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
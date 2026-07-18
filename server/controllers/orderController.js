const prisma = require("../config/prisma");
const razorpay = require("../config/razorpay");

const crypto = require("crypto");

const testRazorpay = async (req, res) => {
  try {
    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
  }
};


const createRazorpayOrder = async (req, res) => {
  try {

    const { orderId } = req.body;

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

    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (order.status !== "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message: "Farmer has not accepted the request yet.",
      });
    }

    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: order.id,
    };

    const razorpayOrder =
      await razorpay.orders.create(options);

    res.json({
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

      orderId,

    } = req.body;

    const generatedSignature = crypto

      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )

      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )

      .digest("hex");

    if (
      generatedSignature !== razorpay_signature
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Payment verification failed",

      });

    }

    const order =
      await prisma.order.findUnique({

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

    await prisma.order.update({

      where: {

        id: orderId,

      },

      data: {

        paymentId:
          razorpay_payment_id,

        paymentStatus: "PAID",

        status: "COMPLETED",

      },

    });

    res.json({

      success: true,

      message:
        "Payment Successful",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

const placeOrder = async (req, res) => {
  try {
    const { cropId, quantity } = req.body;

    const crop = await prisma.crop.findUnique({
      where: {
        id: cropId,
      },
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    if (crop.farmerId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own crop",
      });
    }

    if (quantity > crop.quantity) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    const cropPrice = crop.price * quantity;
    const deliveryCharge = 40;
    const gst = (cropPrice + deliveryCharge) * 0.05;
    const totalPrice = cropPrice + deliveryCharge + gst;

    const order = await prisma.order.create({
      data: {
        quantity,

        cropPrice,
        deliveryCharge,
        gst,
        totalPrice,

        buyerId: req.user.id,
        farmerId: crop.farmerId,
        cropId: crop.id,

        paymentStatus: "PENDING",
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Order request sent successfully",
      order,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const getMyOrders = async (req, res) => {
  try {
    console.log("========= MY ORDERS =========");
    console.log("Logged User:");
    console.log(req.user);

    console.log("Buyer ID:");
    console.log(req.user.id);

    // Check all orders
    const allOrders = await prisma.order.findMany();

    console.log("All Orders:");
    console.log(allOrders);

    const orders = await prisma.order.findMany({
      where: {
        buyerId: req.user.id,
      },
      include: {
        crop: {
          select: {
            cropName: true,
            image: true,
            price: true,
            unit: true,
          },
        },
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            district: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Matched Orders:");
    console.log(orders);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const getFarmerOrders = async (req, res) => {
  try {
    console.log("Logged In User ID:");
    console.log(req.user.id);
    const orders = await prisma.order.findMany({
      where: {
        farmerId: req.user.id,
      },
      include: {
        crop: {
          select: {
            cropName: true,
            image: true,
            unit: true,
            price: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Orders Found:");
console.log(orders);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the order
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    // Check if order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if logged-in user is the farmer
    if (order.farmerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    // Prevent updating an already processed order
    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Order has already been processed",
      });
    }

    // Update status
    const updatedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    res.status(200).json({
      success: true,
      message: `Order ${status.toLowerCase()} successfully`,
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

const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    // Check if order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the buyer (dealer) can complete the order
    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to complete this order",
      });
    }

    // Order must be accepted first
    if (order.status !== "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message: "Only accepted orders can be completed",
      });
    }

    // Update status
    const completedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: "COMPLETED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Order completed successfully",
      order: completedOrder,
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
  createRazorpayOrder,
  verifyPayment,
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  completeOrder,
  testRazorpay,
};
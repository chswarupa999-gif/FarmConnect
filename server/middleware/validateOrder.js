const orderSchema = require("../validations/orderValidation");

const validateOrder = (req, res, next) => {
  const result = orderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  }

  req.body = result.data;

  next();
};

module.exports = validateOrder;
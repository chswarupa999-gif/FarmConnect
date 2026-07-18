const { z } = require("zod");

const statusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

const validateOrderStatus = (req, res, next) => {
  const result = statusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  next();
};

module.exports = validateOrderStatus;
const { z } = require("zod");

const loginSchema = z.object({
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

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

module.exports = validateLogin;
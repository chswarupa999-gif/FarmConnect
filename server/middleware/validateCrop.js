const cropSchema = require("../validations/cropValidation");

const validateCrop = (req, res, next) => {
  const result = cropSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  }

  // Replace req.body with validated and converted values
  req.body = result.data;

  next();
};

module.exports = validateCrop;
const { z } = require("zod");

const orderSchema = z.object({
  cropId: z
    .string()
    .min(1, "Crop ID is required"),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

module.exports = orderSchema;
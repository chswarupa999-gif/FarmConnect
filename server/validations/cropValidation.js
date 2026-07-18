const { z } = require("zod");

const cropSchema = z.object({
  cropName: z
    .string()
    .min(2, "Crop name must be at least 2 characters"),

  quantity: z.coerce.number().positive("Quantity must be greater than 0"),

  unit: z
    .string()
    .min(1, "Unit is required"),

  price: z.coerce.number().positive("Price must be greater than 0"),


  location: z
    .string()
    .min(2, "Location is required"),

  description: z
    .string()
    .min(5, "Description should be at least 5 characters"),
});

module.exports = cropSchema;
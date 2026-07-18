const prisma = require("../config/prisma");

const addCrop = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      unit,
      price,
      location,
      description,
    } = req.body;

    const image = req.file ? req.file.path : null;

    const crop = await prisma.crop.create({
      data: {
        cropName,
        quantity,
        unit,
        price,
        location,
        description,
        image,
        farmerId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Crop added successfully",
      crop,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const getAllCrops = async (req, res) => {
  try {
    const {
      search,
      district,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 5,
    } = req.query;

    // Dynamic filters
    const where = {};

    if (search) {
      where.cropName = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (district) {
      where.location = {
        equals: district,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = Number(minPrice);
      }

      if (maxPrice) {
        where.price.lte = Number(maxPrice);
      }
    }

    // Sorting
    let orderBy = {
      createdAt: "desc",
    };

    if (sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { price: "desc" };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const crops = await prisma.crop.findMany({
      where,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            district: true,
          },
        },
      },
      orderBy,
      skip,
      take: Number(limit),
    });

    // Total records for pagination
    const totalCrops = await prisma.crop.count({
      where,
    });

    res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCrops / Number(limit)),
      totalCrops,
      count: crops.length,
      crops,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const getMyCrops = async (req, res) => {
  try {
    const crops = await prisma.crop.findMany({
      where: {
        farmerId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await prisma.crop.findUnique({
      where: {
        id,
      },
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    if (crop.farmerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let image = crop.image;

    // Upload new image if selected
    if (req.file) {
      image = req.file.path;
    }

    const updatedCrop = await prisma.crop.update({
      where: {
        id,
      },
      data: {
        cropName: req.body.cropName,
        quantity: Number(req.body.quantity),
        unit: req.body.unit,
        price: Number(req.body.price),
        location: req.body.location,
        description: req.body.description,
        image,
      },
    });

    res.status(200).json({
      success: true,
      crop: updatedCrop,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;

    // Find crop
    const crop = await prisma.crop.findUnique({
      where: {
        id,
      },
    });

    // Check if crop exists
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // Check ownership
    if (crop.farmerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this crop",
      });
    }

    // Delete crop
    await prisma.crop.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const getSingleCrop = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await prisma.crop.findUnique({
      where: {
        id,
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            district: true,
            language: true,
          },
        },
      },
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.status(200).json({
      success: true,
      crop,
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
  addCrop,
  getAllCrops,
  getMyCrops,
  updateCrop,
  deleteCrop,
  getSingleCrop,
};
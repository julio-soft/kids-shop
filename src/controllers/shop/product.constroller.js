const db = require("../../models");
const { filterProduct, getPageOffset, getPageCount } = require("./helper");

const sequelize = db.sequelize;
const Product = db.shop.product;
const Image = db.shop.image;
const Category = db.shop.category;
const Tag = db.shop.tag;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).json({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Product
  const product = {
    ...req.body,
  };

  const images = req.body.images;
  const category = req.body.category;
  const tags = req.body.tags;

  const t = await sequelize.transaction();

  try {
    // Save Product in the database

    const data = await Product.create(product, {
      fields: [
        "name",
        "price",
        "stock",
        "description",
        "additional_information",
      ],
    });

    const categoryResponse = await Category.findByPk(category);
    if (categoryResponse) data.setCategory(categoryResponse); // linking categories

    if (images) {
      for (let index = 0; index < images.length; index++) {
        const element = images[index];
        await data.createImage({ ...element }); // creating and linking image
      }
    }

    if (tags) {
      tagResponse = await Tag.findAll({
        where: {
          id: tags,
        },
      });
      data.addTag(tagResponse); // linking
    }

    await t.commit();
    res.json(data);
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message:
        error?.original?.message ||
        error?.message ||
        "Some error occurred while creating the Product.",
    });
  }
};

// Retrieve all Product from the database.
// also filters by conditions passed by parameters
// pagination included if specified
exports.findAll = async (req, res) => {
  // Filter
  const filters = filterProduct(req.query);

  // PAGUINATION
  let { page, pageSize, offset } = getPageOffset(req.query);

  const condition = {
    limit: pageSize,
    offset: offset,
    where: {
      ...filters,
    },
    distinct: true, // count without include
    include: [
      {
        model: Image,
      },
      {
        model: Category,
        as: "category",
        required: true,
      },
      {
        model: Tag,
        as: "tag",
        through: {
          attributes: [],
        },
      },
    ],
  };

  try {
    const data = await Product.findAndCountAll(condition);

    let pageCount = getPageCount(data.count, pageSize);
    res.json({
      page: page,
      pageSize: pageSize,
      pageCount,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Some error occurred while retrieving categories.",
    });
  }
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Product.findByPk(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Product with id=" + id,
    });
  }
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
  const id = req.body.sku;

  try {
    const product = await Product.findByPk(id);

    if (product == null)
      res.json({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
      });

    product.set(req.body);
    await product.save({
      fields: ["name", "price", "description", "additional_information"],
    }); // save fields that can be mutated

    res.json({
      message: "Product was updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error?.original?.message ||
        error?.message ||
        "Some error occurred.",
    });
  }
};

// This provides a SAFE way to UPDATE the STOCK of a product
exports.update_stock = async (req, res) => {
  const id = req.body.sku;
  const increase = req.body.increase;
  const decrease = req.body.decrease;

  // update with a transaction and lock for security and consistency
  const t = await sequelize.transaction();
  try {
    const product = await Product.findByPk(id, { lock: true, transaction: t });

    if (product == null)
      res.json({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
      });

    if (increase) {
      product.stock += increase;
    } else if (req.body.decrease) {
      if(product.stock == 0) return res.status(500).json({message: "Cant decrease becuse product stock is 0"})
      product.stock -= decrease;
    }

    await product.save({ transaction: t });

    await t.commit();

    res.json({
      message: "Product was updated successfully.",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message:
        error?.original?.message ||
        error?.message ||
        "Some error occurred.",
    });
  }
};

// Delete a Product with the specified id in the request
exports.delete = async (req, res) => {
  const sku = req.params.id;

  try {
    const resp = await Product.destroy({
      where: { sku: sku },
    });

    if (resp == 1) {
      res.json({
        message: "Product was deleted successfully!",
      });
    } else {
      res.json({
        message: `Cannot delete Product with sku=${sku}. Maybe Product was not found!`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Could not delete Product with id=" + sku,
    });
  }
};

// Count all Product from the database
// that match by conditions passed by parameters
exports.findAllCount = async (req, res) => {
  // Filter
  console.log("asdasdas");
  const filters = filterProduct(req.query);

  debugger;
  const condition = {
    where: {
      ...filters,
    },
    distinct: true, // count without include
    include: [
      {
        model: Image,
      },
      {
        model: Category,
        as: "category",
        required: true,
      },
      {
        model: Tag,
        as: "tag",
        through: {
          attributes: [],
        },
      },
    ],
  };

  try {
    const data = await Product.count(condition);
    res.json({
      count: data,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Some error occurred while retrieving categories.",
    });
  }
};

const db = require("../../models");
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
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Product
  const product = {
    ...req.body,
  };

  const image = req.body.image;
  const category = req.body.category;
  const tags = req.body.tags;

  try {
    // Save Product in the database
    const t = await sequelize.transaction();

    const data = await Product.create(Product, {
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

    if (image) {
      image.forEach((element) => {
        data.createImage({ ...element }); // creating and linking image
      });
    }

    tagResponse = Tag.findAll({
      where: {
        id: tags,
      },
    });
    if (tags) category.addTags(tagResponse); // linking

    await t.commit();

    res.send(data);
  } catch (error) {
    await t.rollback();
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Product.",
    });
  }
};

// Retrieve all Product from the database.
// also filters by conditions passed by parameters
// pagination included if specified
exports.findAll = async (req, res) => {
  const filters = {};

  if (req?.query?.sku) filters.sku = { [Op.eq]: req?.query?.sku };
  if (req?.query?.name) filters.name = { [Op.like]: `%${req?.query?.name}%` };
  if (req?.query?.price) filters.price = { [Op.eq]: req?.query?.price };
  if (req?.query?.stock) filters.stock = { [Op.eq]: req?.query?.stock };

  if (req?.query?.description)
    filters.description = { [Op.like]: `%${req?.query?.description}%` };

  if (req?.query?.additional_information)
    filters.additional_information = {
      [Op.like]: `%${req?.query?.additional_information}%`,
    };

  if (req?.query?.category)
    filters["$Category.name$"] = { [Op.like]: `%${req?.query?.category}%` };
  if (req?.query?.tags)
    filters["$Tag.name$"] = { [Op.like]: `%${req?.query?.tags}%` };

  const page = req?.query?.page || null; // pagination included if specified
  const offset = page && page * 10 - 10;

  const condition = {
    limit: 10,
    offset,
    where: {
      ...filters,
    },
    include: [
      {
        model: Image,
      },
      {
        model: Category,
        as: "Category",
      },
      {
        model: Tag,
        as: "Tag",
      },
    ],
  };

  try {
    const data = await Product.findAndCountAll(condition);
    res.send(data);
  } catch (error) {
    res.status(500).send({
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
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving Product with id=" + id,
    });
  }
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
  const id = req.body.id;

  try {
    const product = await Product.findByPk(id);

    if (product == null)
      res.send({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
      });

    product.set(req.body);
    await product.save({
      fields: ["name", "price", "description", "additional_information"],
    }); // save fields that can be mutated

    res.send({
      message: "Product was updated successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};

// This provides a SAFE way to UPDATE the STOCK of a product
exports.update_stock = async (req, res) => {
  const id = req.body.id;
  const increase = req.body.increase;
  const decrease = req.body.decrease;

  try {
    // update with a transaction and lock for security and consistency
    const t = await sequelize.transaction();

    const product = await Product.findByPk(id, { lock: true, transaction: t });

    if (product == null)
      res.send({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
      });

    if (increase) {
      product.stock += increase;
    } else if (req.body.decrease) {
      product.stock -= decrease;
    }

    await product.save({ transaction: t });

    await t.commit();

    res.send({
      message: "Product was updated successfully.",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};

// Delete a Product with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const resp = await Product.destroy({
      where: { id: id },
    });

    if (resp == 1) {
      res.send({
        message: "Product was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete Product with id=" + id,
    });
  }
};

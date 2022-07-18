const db = require("../models");
const Category = db.shop.category;
const Op = db.Sequelize.Op;

// Create and Save a new Category
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Category
  const category = {
    name: req.body?.name,
  };

  try {
    // Save Category in the database
    const data = await Category.create(category);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Category.",
    });
  }
};

// Retrieve all Category from the database.
exports.findAll = async (req, res) => {
  const name = req.query?.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  try {
    const data = await Category.findAll({ where: condition });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving categories.",
    });
  }
};

// Find a single Category with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Category.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving Category with id=" + id,
    });
  }
};

// Update a Category by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findByPk(id);

    if (category == null)
      res.send({
        message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`,
      });

    category.set(req.body);
    await category.save({ fields: ["name"] }); // save fields that can be mutated

    res.send({
      message: "Category was updated successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error updating Category with id=" + id,
    });
  }
};

// Delete a Category with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const resp = await Category.destroy({
      where: { id: id },
    });

    if (resp == 1) {
      res.send({
        message: "Category was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Category with id=${id}. Maybe Category was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete Category with id=" + id,
    });
  }
};

// Delete all Category from the database.
exports.deleteAll = async (req, res) => {
  try {
    const resp = await Category.destroy({
      where: {},
      truncate: false,
    });

    res.send({ message: `${resp} Categories were deleted successfully!` });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while removing all category.",
    });
  }
};

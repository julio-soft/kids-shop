const db = require("../../models");
const Tag = db.shop.tag;
const Op = db.Sequelize.Op;

// CREATE and Save a new Tag
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tag
  const tag = {
    ...req.body
  };

  try {
    // Save Tag in the database
    const data = await Tag.create(Tag);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Tag.",
    });
  }
};

// Retrieve all Tag from the database.
exports.findAll = async (req, res) => {
  const name = req.query?.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  try {
    const data = await Tag.findAll({ where: condition });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving categories.",
    });
  }
};

// Find a single Tag with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Tag.findByPk(id);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving Tag with id=" + id,
    });
  }
};

// Update a Tag by the id in the request
exports.update = async (req, res) => {
  const id = req.body.id;

  try {
    const tag = await Tag.findByPk(id);

    if (tag == null)
      res.send({
        message: `Cannot update Tag with id=${id}. Maybe Tag was not found or req.body is empty!`,
      });

    tag.set(req.body);
    await Tag.save({ fields: ["name"] }); // save fields that can be mutated

    res.send({
      message: "Tag was updated successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error updating Tag with id=" + id,
    });
  }
};

// Delete a Tag with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const resp = await Tag.destroy({
      where: { id: id },
    });

    if (resp == 1) {
      res.send({
        message: "Tag was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Tag with id=${id}. Maybe Tag was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete Tag with id=" + id,
    });
  }
};

// Delete all Tag from the database.
exports.deleteAll = async (req, res) => {
  try {
    const resp = await Tag.destroy({
      where: {},
      truncate: false,
    });

    res.send({ message: `${resp} Categories were deleted successfully!` });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while removing all Tag.",
    });
  }
};

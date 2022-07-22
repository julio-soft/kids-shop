const db = require("../../models");
const Valoracion = db.shop.valoracion;
const Op = db.Sequelize.Op;

// CREATE and Save a new Valoracion
exports.create = async (req, res) => {
  // Create a Valoracion
  const valoracion = {
    ...req.body,
  };

  try {
    // Save Valoracion in the database
    const data = await Valoracion.create(valoracion);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Some error occurred while creating the Valoracion.",
    });
  }
};

// Find a single Valoracion with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Valoracion.findByPk(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Valoracion with id=" + id,
    });
  }
};

// Find all Valoracion with sku of the product
exports.findAllByProduct = async (req, res) => {
  const sku = req.params.sku;

  try {
    const data = await Valoracion.findAll({
      include: [
        {
          model: db.shop.product,
          where: { sku: sku },
        },
      ],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Valoraciones with id=" + sku,
    });
  }
};

// Update a Valoracion by the id in the request
exports.update = async (req, res) => {
  const id = req.body.id;

  try {
    const valoracion = await Valoracion.findByPk(id);

    if (valoracion == null)
      res.status(400).json({
        message: `Cannot update Valoracion with id=${id}. Maybe Valoracion was not found or req.body is empty!`,
      });

    valoracion.set(req.body);
    await valoracion.save(); // save fields that can be mutated

    res.json({
      message: "Valoracion was updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Valoracion with id=" + id,
    });
  }
};

// Delete a Valoracion with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const resp = await Valoracion.destroy({
      where: { id: id },
    });

    if (resp == 1) {
      res.json({
        message: "Valoracion was deleted successfully!",
      });
    } else {
      res.status(400).json({
        message: `Cannot delete Valoracion with id=${id}. Maybe Valoracion was not found!`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Could not delete Valoracion with id=" + id,
    });
  }
};

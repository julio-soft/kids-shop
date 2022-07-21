const db = require("../../models");

const sequelize = db.sequelize;
const Seles = db.shop.sele;
const Product = db.shop.product;
const User = db.user;

const { sell_product } = require("./helper");

// Sell a Product
exports.sell = async (req, res) => {
  const id = req.body.sku;

  // SELL with a transaction and lock for security and consistency
  const t = await sequelize.transaction();
  try {
    const result = await sell_product(id, req.userId, t);

    if (result === true) {
      res.status(200).json({
        message: "Product was sell successfully.",
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message:
        error?.original?.message ||
        error?.message ||
        "Some error occurred while selling the Product.",
    });
  }
};

// List all product sold
exports.seles = async (req, res) => {
  try {
    const data = await Seles.findAll({
      attributes: ["sale_price", "createdAt"],
      include: [
        {
          model: Product,
        },
      ],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Some error occurred while retrieving product sold.",
    });
  }
};

// Total profit of the product sold
exports.profit = (req, res) => {
  
};

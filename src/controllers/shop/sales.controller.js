const db = require("../../models");

const sequelize = db.sequelize;
const Sales = db.shop.sele;
const Product = db.shop.product;

// Sell a Product
exports.sell = async (req, res) => {
  const id = req.body.sku;

  // SELL with a transaction and lock for security and consistency
  const t = await sequelize.transaction();
  try {
    const product = await Product.findByPk(id, { lock: true, transaction: t });

    if (product == null)
      res.json({
        message: `Cannot sell Product with sku=${id}. Maybe Product was not found or req.body is empty!`,
      });

    product.stock -= decrease;

    if (product.stock < 0)
      return res
        .status(500)
        .json({ message: "Can't sell. The product is sold out!" });

    await product.save({ transaction: t });

    await t.commit();
    res.status(200).json({
      message: "Product was sell successfully.",
    });
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

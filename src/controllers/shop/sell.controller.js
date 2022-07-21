const db = require("../../models");

const sequelize = db.sequelize;
const Seles = db.shop.sele;
const Product = db.shop.product;
const Image = db.shop.image;
const Category = db.shop.category;
const Tag = db.shop.tag;
const User = db.user;

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

    product.stock -= 1;

    if (product.stock < 0)
      return res
        .status(500)
        .json({ message: "Can't sell. The product is sold out!" });

    const sale = await Seles.create(
      { sale_price: product.price },
      { transaction: t }
    );
    await sale.setProduct(product, { transaction: t });
    const user = await User.findByPk(req.userId);
    await sale.setUser(user, { transaction: t });

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

// List all product sold
exports.seles = async (req, res) => {
  try {
    const data = await Seles.findAll({
      attributes: ["sale_price"],
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

}

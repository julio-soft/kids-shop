const db = require("../../models");
const Op = db.Sequelize.Op;

var squel = require("squel");

const Seles = db.shop.sele;
const Product = db.shop.product;
const User = db.user;

// Sell a Product
exports.sell_product = async (id_product, id_user) => {
  // SELL with a transaction and lock for security and consistency
  const t = await db.sequelize.transaction();

  try {
    // SELL with a transaction and lock for security and consistency
    const product = await Product.findByPk(id_product, {
      lock: true,
      transaction: t,
    });

    const user = await User.findByPk(id_user, { transaction: t });

    if (user == null) {
      throw new Error(`Cannot sell Product to user id=${id_user}!`);
    }

    if (product == null) {
      throw new Error(
        `Cannot sell Product with sku=${id_product}. Maybe Product was not found or req.body is empty!`
      );
    }

    product.stock -= 1;

    if (product.stock < 0) {
      throw new Error("Can't sell. The product is sold out!");
    }

    const sale = await Seles.create(
      { sale_price: product.price },
      { transaction: t }
    );
    await sale.setProduct(product, { transaction: t });
    await sale.setUser(user, { transaction: t });

    await product.save({ transaction: t });

    await t.commit();

    return true;
  } catch (error) {
    await t.rollback();
    return {
      message:
        error?.original?.message ||
        error?.message ||
        "Some error occurred while selling the Product.",
    };
  }
};

// Create a filter for Product
exports.filterProduct = (query) => {
  const filters = {};

  if (query?.sku) filters.sku = { [Op.eq]: query?.sku };
  if (query?.name) filters.name = { [Op.like]: `%${query?.name}%` };
  if (query?.price) filters.price = { [Op.eq]: query?.price };
  if (query?.stock) filters.stock = { [Op.eq]: query?.stock };

  if (query?.description)
    filters.description = { [Op.like]: `%${query?.description}%` };

  if (query?.additional_information)
    filters.additional_information = {
      [Op.like]: `%${query?.additional_information}%`,
    };

  if (query?.category)
    filters["$category.name$"] = { [Op.like]: `%${query?.category}%` };

  return filters;
};

exports.getPageOffset = (query) => {
  const pagination = {};

  pagination.page = query?.page || 1; // pagination included if specified
  pagination.pageSize = query?.pageSize || 10; // pageSize 10 if not specifie
  pagination.pageSize *= 1;
  pagination.page *= 1;
  pagination.offset =
    pagination.page * pagination.pageSize - pagination.pageSize;

  return pagination;
};

exports.getPageCount = (count, pageSize) => {
  let pageCount = parseInt(count / pageSize);
  let resto = count % pageSize;

  if (resto != 0) pageCount++;

  return pageCount;
};

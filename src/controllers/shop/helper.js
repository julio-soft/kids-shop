const db = require("../../models");
const Op = db.Sequelize.Op;

var squel = require("squel");

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
  //if (query?.tags) filters["$tag.name$"] = { [Op.like]: `%${query?.tags}%` };

  return filters;
};

exports.filterProductQuery = (filter) => {
  const query = squel
    .select()
    .from("products", "p")
    .field("p.sku", "sku")
    .field("p.name", "name")
    .field("p.price", "price")
    .field("p.stock", "stock")
    .field("p.descriprion", "description")
    .field("p.additional_information", "additional_information");

  const filtro = squel.expr();

  if (filter?.sku) filtro.and("sku = ?", filter.sku);
  if (filter?.name) filtro.and("name LIKE %?%", filter.name);
  if (filter?.price) filtro.and("price = ?", filter.price);

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
  //if (query?.tags) filters["$tag.name$"] = { [Op.like]: `%${query?.tags}%` };

  return filters;
};

exports.getPageOffset = (query) => {
  const pagination = {};

  pagination.page = query?.page || 0; // pagination included if specified
  pagination.pageSize = query?.pageSize || 10; // pageSize 10 if not specifie
  pagination.pageSize *= 1;
  pagination.offset =
    pagination.page && pagination.page * pagination.pageSize - 10;

  return pagination;
};

exports.getPageCount = (count, pageSize) => {
  let pageCount = parseInt(count / pageSize);
  let resto = count % pageSize;

  if (resto != 0) pageCount++;

  return pageCount;
};

module.exports = (sequelize, Sequelize) => {
  // MODEL Product
  const product = sequelize.define("products", {
    sku: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    stock: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    additional_information: {
      type: Sequelize.TEXT,
    },
  });

  // MODEL category of product
  const category = sequelize.define("categories", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });

  // MODEL Etiquetas asociada a los product
  const tag = sequelize.define("tags", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });

  // MODEL Imagen asociada a los product
  const image = sequelize.define("images", {
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true, // string no vacio
      },
    },
  });

  // MODEL Valoracion asociada a los product
  const valoracion = sequelize.define("valoraciones", {
    stars: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        max: 5, // de 1 a 5 estrellas
        min: 1,
      },
    },
    comment: {
      type: Sequelize.TEXT,
    },
  });

  // ******  RELACIONES entre Modelos ***********

  // relacion de product - tags
  product.belongsToMany(tag, {
    through: "product_tags",
    foreignKey: "skuId",
    otherKey: "tagId",
    as: "tag",
  });

  tag.belongsToMany(product, {
    through: "product_tags",
    foreignKey: "tagId",
    otherKey: "skuId",
    as: "product",
  });

  // relacion product - categoria
  category.hasMany(product, {
    foreignKey: "categoryId",
    as: "product",
  });
  product.belongsTo(category, { as: "category" });

  // relacion product - imagenes
  product.hasMany(image, {
    foreignKey: "productSku",
  });
  image.belongsTo(product);

  // relacion product - valoracion
  product.hasMany(valoracion);
  valoracion.belongsTo(product);

  return {
    product,
    category,
    tag,
    image,
    valoracion,
  };
};

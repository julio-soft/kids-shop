const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  // MODEL Producto
  const producto = sequelize.define("productos", {
    sku: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    cantidad: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    informacion_add: {
      type: Sequelize.TEXT,
    },
  });

  // MODEL Categoria de productos
  const categoria = sequelize.define("categorias", {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  // MODEL Etiquetas asociada a los productos
  const tag = sequelize.define("tags", {
    tag_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  // MODEL Imagen asociada a los productos
  const imagen = sequelize.define("imagenes", {
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // string no vacio
      },
    },
  });

  // MODEL Valoracion asociada a los productos
  const valoracion = sequelize.define("valoraciones", {
    estrellas: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        max: 5, // de 1 a 5 estrellas
        min: 1,
      },
    },
    comentario: {
      type: Sequelize.TEXT,
    },
  });

  // ******  RELACIONES entre Modelos ***********

  // relacion de producto - tags
  producto.belongsToMany(tag, {
    through: "producto_tags",
    foreignKey: "skuId",
    otherKey: "tagId",
  });

  tag.belongsToMany(producto, {
    through: "producto_tags",
    foreignKey: "tagId",
    otherKey: "skuId",
  });

  // relacion producto - categoria
  categoria.hasMany(producto, {
    foreignKey: "categoriaId",
  });
  producto.belongsTo(categoria);

  // relacion producto - imagenes
  producto.hasMany(imagen, {
    foreignKey: "productoId",
  });
  imagen.belongsTo(producto);

  // relacion producto - valoracion
  producto.hasMany(valoracion, {
    foreignKey: "productoId",
  });
  valoracion.belongsTo(producto);

  return {
    producto,
    categoria,
    tag,
    imagen,
    valoracion,
  };
};

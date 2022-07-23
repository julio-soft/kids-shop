const db = require("./index");

var bcrypt = require("bcryptjs");

const Role = db.role;
const user = db.user;

const product = db.shop.product;
const category = db.shop.category;
const tag = db.shop.tag;

/*
 * Se realizar una carga inical a la BD.
 */

module.exports = async function initial() {
  await user_initial();
  await initial_product();
};

async function user_initial() {
  // **** ROLE ****
  let role_user = await Role.create({
    id: 1,
    name: "user",
  });

  let role_mod = await Role.create({
    id: 2,
    name: "moderator",
  });

  let role_admin = await Role.create({
    id: 3,
    name: "admin",
  });

  // *************

  // **** User *****

  let user_admin = await user.create({
    username: "admin",
    email: "admin@shop.com",
    password: bcrypt.hashSync("admin", 8),
  });

  await user_admin.addRole(role_admin);

  let user_mod = await user.create({
    username: "moderator",
    email: "moderator@shop.com",
    password: bcrypt.hashSync("moderator", 8),
  });

  await user_mod.addRole(role_mod);

  let user_user = await user.create({
    username: "user",
    email: "user@user.com",
    password: bcrypt.hashSync("user", 8),
  });

  await user_user.addRole(role_user);
}

async function initial_product() {
  // **** Category *****
  let category_1 = await category.create({
    name: "For Girls",
  });

  let category_2 = await category.create({
    name: "For Boys",
  });

  let category_3 = await category.create({
    name: "For Babies",
  });

  let category_4 = await category.create({
    name: "For Home",
  });

  let category_5 = await category.create({
    name: "For Play",
  });

  // *************

  // **** Tags *****

  let tags_1 = await tag.create({
    name: "Blouse",
  });

  let tags_2 = await tag.create({
    name: "Girls",
  });

  let tags_3 = await tag.create({
    name: "Boys",
  });

  let tags_4 = await tag.create({
    name: "Red",
  });

  let tags_5 = await tag.create({
    name: "Shorts",
  });

  // *************

  let product_1 = await product.create({
    name: "Shorts",
    price: 50.4,
    stock: 40,
    description: "Short de boys perfecto para una salida.",
  });

  await product_1.createImage({ url: "/imagen/1" });
  await product_1.createImage({ url: "/imagen/2" });
  await product_1.setCategory(category_2);
  await product_1.addTag([tags_3, tags_5]);

  let product_2 = await product.create({
    name: "Blue Blouse",
    price: 23.45,
    stock: 40,
    description: "Hermosa Blue Blouse.",
  });

  await product_2.createImage({ url: "/imagen/3" });
  await product_2.setCategory(category_1);
  await product_2.addTag([tags_1, tags_2]);

  let product_3 = await product.create({
    name: "Shoes",
    price: 23.45,
    stock: 40,
    description: "Zapatos muy duraderos.",
    additional_information: "Esto es una informacion adicional.",
  });

  await product_3.createImage({ url: "/imagen/4" });
  await product_3.setCategory(category_5);
  await product_3.addTag([tags_3, tags_4]);
  await product_3.createValoracione({stars: 5, comment: "Excelente producto!"})
  await product_3.createValoracione({stars: 4, comment: "Buen producto!"})

  for (let i = 5; i <= 20; i++) {

    let product_4 = await product.create({
      name: `Shoes ${i}`,
      price: 23.45,
      stock: 40,
      description: `Zapatos muy duraderos. ${i}`,
      additional_information: `Esto es una informacion adicional. ${i}`,
    });
  
    await product_4.createImage({ url: `/imagen/${i}` });
    await product_4.setCategory(category_5);
    await product_4.addTag([tags_3, tags_4]);
  }

  let product_5 = await product.create({
    name: "Pulover",
    price: 20,
    stock: 0,
    description: "pulover muy duraderos.",
    additional_information: "Esto es una informacion adicional.",
  });

  await product_5.setCategory(category_5);
  await product_5.addTag([tags_3, tags_4]);

}

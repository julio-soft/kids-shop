// TEST UNITARIOS

const db = require("../src/models");
var bcrypt = require("bcryptjs");

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});


describe("UNIT TEST: Modelos", () => {
  it("Registered user", async () => {
    let user = await db.user.create({
      username: "admin2",
      email: "admin2@shop.com",
      password: bcrypt.hashSync("admin", 8),
    });
    expect(user).toHaveProperty("username");
  });

  it("An already registered user cannot be registered", async () => {
    try {
      let user = await db.user.create({
        username: "admin2",
        email: "admin2@shop.com",
        password: bcrypt.hashSync("admin", 8),
      });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(error);
    }
  });

  it("Registered a product", async () => {
    let product = await db.shop.product.create({
      name: "Blue Blouse",
      price: 23.45,
      stock: 40,
      description: "Hermosa Blue Blouse.",
    });
    expect(product.price).toEqual(23.45);
    expect(product.name).toEqual("Blue Blouse");
  });

  it("Registered a product with default stock 0", async () => {
    let product = await db.shop.product.create({
      name: "Blue Blouse",
      price: 23.45,
      description: "Hermosa Blue Blouse.",
    });
    expect(product.stock).toEqual(0);
    expect(product.name).toEqual("Blue Blouse");
  });

  it("Registered a product with images", async () => {
    let product = await db.shop.product.create({
      name: "Blue Blouse",
      price: 23.45,
      stock: 20,
      description: "Hermosa Blue Blouse.",
    });

    await product.createImage({ url: "/asdasd/" });
    await product.createImage({ url: "/asdasdasd/" });
    await product.createImage({ url: "/asdasasdsd/" });

    expect(product.stock).toEqual(20);
    expect(product.name).toEqual("Blue Blouse");
    expect(await product.countImages()).toEqual(3);
  });
});

const request = require("supertest");

const app = require("../server");

const db = require("../src/models");
const initial = require("../src/models/init");

// TEST de INTEGRATION

beforeAll(() => {
  return db.sequelize.sync({ force: true }).then(async () => {
    await initial();
  });
});

describe("INTEGRATION TEST: Create Product of de Shop", () => {
  test("SignIn a user", (done) => {
    request(app)
      .post("/apiv1/auth/signin")
      .expect("Content-Type", /json/)
      .send({
        username: "admin",
        password: "admin",
      })
      .expect(200)
      .expect((res) => {
        if (!("username" in res.body)) throw new Error("missing next key");
        if (!("email" in res.body)) throw new Error("missing prev key");
        if (!("roles" in res.body)) throw new Error("missing prev key");
        if (!("accessToken" in res.body)) throw new Error("missing prev key");
      })
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.accessToken;
        return done();
      });
  });

  test("Product created", (done) => {
    request(app)
      .post("/apiv1/product/")
      .set("x-access-token", token)
      .send({
        name: "prodcuto pepe",
        price: 58,
        stock: 541,
        description: "Una description de prueba.",
        category: 1,
        tags: [1, 2, 3],
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((res) => {
        if (!(res.body.name === "prodcuto pepe"))
          throw new Error(`Don't match. Value: ${res.body.name}`);
        if (!(res.body.price === 58))
          throw new Error(`Don't match. Value: ${res.body.price}`);
        if (!(res.body.categoryId === 1))
          throw new Error(`Don't match. Value: ${res.body.categoryId}`);
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Product created with fail", (done) => {
    request(app)
      .post("/apiv1/product/")
      .set("x-access-token", token)
      .send({
        name: "shoe",
        description: "zapatos",
        stock: 30,
      })
      .expect("Content-Type", /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Stock no specific. Create with default value 0", (done) => {
    request(app)
      .post("/apiv1/product/")
      .set("x-access-token", token)
      .send({
        name: "New Producto",
        price: 58,
        description: "Una description de prueba.",
        category: 1,
        tags: [1, 2, 3],
        images: [
          { url: "/asdasd/" },
          { url: "/asdasd/asdad" },
          { url: "/asd/asdghhhf" },
        ],
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((res) => {
        if (!(res.body.stock === 0))
          throw new Error(`Don't match. Value: ${res.body.stock}`);
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Url image Unique. Can't create.", (done) => {
    request(app)
      .post("/apiv1/product/")
      .set("x-access-token", token)
      .send({
        name: "New Producto",
        price: 10,
        stock: 541,
        description: "Una description de prueba.",
        category: 1,
        tags: [1, 2, 3],
        images: [
          { url: "/asdasd/" },
          { url: "/asdasd/asdad" },
          { url: "/asd/asdghhhf" },
        ],
      })
      .expect("Content-Type", /json/)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

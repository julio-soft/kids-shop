const request = require("supertest");

const app = require("../server");

const db = require("../src/models");
const initial = require("../src/models/init");

// INTEGRATION TEST

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  await initial();
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("INTEGRATION TEST: Sell Product of de Shop", () => {
  test("Sigin User", (done) => {
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

  test("Product sold", async () => {
    let resProd = await request(app)
      .get("/apiv1/product/1")
      .expect("Content-Type", /json/)
      .set("x-access-token", token)
      .expect(200);

    const stock_before_sell = resProd.body.stock;

    const res = await request(app)
      .post("/apiv1/sell/")
      .expect("Content-Type", /json/)
      .set("x-access-token", token)
      .send({
        sku: 1,
      })
      .expect(200);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Product was sell successfully.");

    resProd = await request(app)
      .get("/apiv1/product/1")
      .expect("Content-Type", /json/)
      .set("x-access-token", token)
      .expect(200);

    const stock_after_sell = resProd.body.stock;

    expect(stock_before_sell - 1).toEqual(stock_after_sell);
  });

  test("List Sold Product", async () => {
    let sales = await request(app)
      .get("/apiv1/sell/all")
      .expect("Content-Type", /json/)
      .set("x-access-token", token)
      .expect(200);

    expect(sales.body.length).toEqual(1);
  });

  test("Get Profit", async () => {
    let res = await request(app)
      .get("/apiv1/sell/profit")
      .expect("Content-Type", /json/)
      .set("x-access-token", token)
      .expect(200);

    expect(res.body).toHaveProperty("profit");
    expect(res.body.profit).toEqual(50.4);
  });

  test("Get product with 0 stock", async () => {
    let res = await request(app)
      .get("/apiv1/product/noStock")
      .expect("Content-Type", /json/)
      .set("x-access-token", token)
      .expect(200);

    expect(res.body).toHaveProperty("soldOut");
    expect(res.body.soldOut.length).toEqual(1);
  });
});

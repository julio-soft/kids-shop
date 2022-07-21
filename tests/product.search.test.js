const request = require("supertest");

const app = require("../server");

const db = require("../src/models");
const initial = require("../src/models/init");

// INTEGRATION TEST

beforeAll(() => {
  return db.sequelize.sync({ force: true }).then(async () => {
    await initial();
  });
});

afterAll(() => {
  return db.sequelize.close();
});

describe("INTEGRATION TEST: Product of de Shop", () => {
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

  test("All product", (done) => {
    request(app)
      .get("/apiv1/product/")
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        if (!(res.body.count == 20))
          throw new Error(`Don't match. Value: ${res.body.count}`);
        if (!(res.body.pageCount == 2))
          throw new Error(`Don't match. Value: ${res.body.pageCount}`);
        if (!(res.body.pageSize == 10))
          throw new Error(`Don't match. Value: ${res.body.pageSize}`);
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Filter product by name, paguination", (done) => {
    request(app)
      .get("/apiv1/product/")
      .set("x-access-token", token)
      .query({
        name: "short",
        pageSize: 5,
        page: 1,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        if (!(res.body.count == 1))
          throw new Error(`Don't match. Value: ${res.body.count}`);
        if (!(res.body.pageCount == 1))
          throw new Error(`Don't match. Value: ${res.body.pageCount}`);
        if (!(res.body.pageSize == 5))
          throw new Error(`Don't match. Value: ${res.body.pageSize}`);
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Filter by name and description with paguination", (done) => {
    request(app)
      .get("/apiv1/product/")
      .set("x-access-token", token)
      .query({
        name: "shoe",
        description: "zapatos",
        pageSize: 5,
        page: 1,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        if (!(res.body.count == 17))
          throw new Error(`Don't match. Value: ${res.body.count}`);
        if (!(res.body.pageCount == 4))
          throw new Error(`Don't match. Value: ${res.body.pageCount}`);
        if (!(res.body.pageSize == 5))
          throw new Error(`Don't match. Value: ${res.body.pageSize}`);
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Count product thath match name.", (done) => {
    request(app)
      .get("/apiv1/product/count")
      .set("x-access-token", token)
      .query({
        name: "short",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        if (!(res.body.count == 1))
          throw new Error(`Don't match. Value: ${res.body.count}`);
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

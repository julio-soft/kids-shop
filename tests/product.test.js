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
        if (!(res.body.length == 19)) throw new Error("missing next key");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Authenticated client can access to User url", (done) => {
    request(app)
      .get("/apiv1/test/user")
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(200, {
        message: "User Content.",
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Authenticated client can't access to the staff url", (done) => {
    request(app)
      .get("/apiv1/test/mod")
      .set("x-access-token", token)
      .expect("Content-Type", /json/)
      .expect(403, {
        message: "Require Moderator Role!",
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

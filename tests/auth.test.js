const request = require("supertest");

const app = require("../server");

const db = require("../src/models");
const initial = require("../src/models/init");

// INTEGRATION TEST

// Applies to all tests in this file
// this methodo will run before
beforeAll(() => {
  return db.sequelize.sync({ force: true }).then(async () => {
    await initial();
  });
});

afterAll(() => {
  // return db.sequelize.sync({ force: true });
});

describe("INTEGRATION TEST: Authentication and Authorization and middleware", () => {
  test("SignUp a new user", (done) => {
    request(app)
      .post("/apiv1/auth/signup")
      .expect("Content-Type", /json/)
      .send({
        username: "julio",
        email: "julio@gmail.com",
        password: "123",
        roles: ["user"],
      })
      .expect(201)
      .expect((res) => {
        res.body.message = "User was registered successfully!";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("SignIn a user", (done) => {
    request(app)
      .post("/apiv1/auth/signin")
      .expect("Content-Type", /json/)
      .send({
        username: "julio",
        password: "123",
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

  test("Path open without authentication", (done) => {
    request(app)
      .get("/apiv1/test/all")
      .expect("Content-Type", /json/)
      .expect(200, {
        message: "Public Content.",
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Authenticated client can access to user url", (done) => {
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

const request = require("supertest");

const app = require("../server");

describe("Test Authentication and Authorization", () => {
  test("POST /apiv1/auth/signup", (done) => {
    request(app)
      .post("/apiv1/auth/signup")
      .expect("Content-Type", /json/)
      .send({
        username: "julio",
        email: "jcgoza97@gmail.com",
        password: "123",
      })
      .expect(201)
      .expect((res) => {
        res.body.data.message = "User was registered successfully!";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test("POST /apiv1/auth/signin", (done) => {
    request(app)
      .post("/apiv1/auth/signin")
      .expect("Content-Type", /json/)
      .send({
        username: "julio",
        password: "123",
      })
      .expect(200)
      .expect((res) => {
        res.body.data.username = "julio";
        res.body.data.email = "jcgoza97@gmail.com";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});

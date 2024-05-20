const User = require("../models/User");
const supertest = require("supertest");
const chai = require("chai");
const server = require("../server");

const expect = chai.expect;

describe("Auth API", () => {
  after(() => {
    return User.deleteMany({
      username: {
        $in: ["testuser1", "testuser2"],
      },
    });
  });

  it("should login a user and get a token", (done) => {
    const user = new User({
      username: "testuser1",
      password: "password123",
      isAdmin: true,
    });
    user.save().then(() => {
      supertest(server)
        .post("/api/auth/login")
        .send({ username: "testuser1", password: "password123" })
        .end((err, res) => {
          expect(res.status).to.be.eq(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("token");
          done();
        });
    });
  });

  it("should login a user with wrong password", (done) => {
    const user = new User({
      username: "testuser2",
      password: "password321",
      isAdmin: true,
    });
    user.save().then(() => {
      supertest(server)
        .post("/api/auth/login")
        .send({ username: "testuser2", password: "password" })
        .end((err, res) => {
          expect(res.status).to.be.eq(401);
          expect(res.body)
            .to.have.property("message")
            .eq("Invalid credentials");
          done();
        });
    });
  });
});

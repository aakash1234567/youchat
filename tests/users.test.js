const User = require("../models/User");
const chai = require("chai");
const supertest = require("supertest");
const server = require("../server");
const jwt = require("jsonwebtoken");

const expect = chai.expect;
let token;

describe("User API", () => {
  before((done) => {
    new User({
      username: "admin",
      password: "password123",
      isAdmin: true,
    })
      .save()
      .then((user) => {
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        done();
      });
  });

  after(() => {
    return Promise.all([
      User.deleteMany({
        username: {
          $eq: "admin",
        },
      }),
      User.deleteMany({
        username: {
          $eq: "updateduser",
        },
      }),
    ]);
  });

  it("should create a user", (done) => {
    supertest(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "newuser", password: "password123", isAdmin: false })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("username").eq("newuser");
        done();
      });
  });

  it("should edit a user", (done) => {
    User.findOne({ username: "newuser" }).then((user) => {
      supertest(server)
        .put(`/api/users/${user._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "updateduser" })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("username").eq("updateduser");
          done();
        });
    });
  });

  it("should search for a user", (done) => {
    supertest(server)
      .get(`/api/users?username=${encodeURI("update")}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array").to.have.lengthOf(1);
        done();
      });
  });
});

const Group = require("../models/Group");
const User = require("../models/User");
const chai = require("chai");
const supertest = require("supertest");
const server = require("../server");
const jwt = require("jsonwebtoken");

const expect = chai.expect;
let token;

describe("Group API", () => {
  before(() => {
    const user = new User({ username: "groupuser", password: "password123" });
    return user.save().then((user) => {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    });
  });

  after(() => {
    return Promise.all([
      User.deleteMany({
        username: {
          $eq: "groupuser",
        },
      }),
      Group.deleteMany({
        name: {
          $eq: "Test Group",
        },
      }),
    ]);
  });

  it("should create a group", (done) => {
    supertest(server)
      .post("/api/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Group" })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("name").eq("Test Group");
        done();
      });
  });

  it("should add a member to the group", (done) => {
    Group.findOne({ name: "Test Group" }).then((group) => {
      User.findOne({ username: "groupuser" }).then((user) => {
        supertest(server)
          .post("/api/groups/add-member")
          .set("Authorization", `Bearer ${token}`)
          .send({ groupId: group._id, userId: user._id })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body)
              .to.have.property("members")
              .to.include(user._id.toString());
            done();
          });
      });
    });
  });

  it("should search for a group", (done) => {
    supertest(server)
      .get(`/api/groups?name=${encodeURI("Test Group")}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array").to.have.lengthOf(1);
        done();
      });
  });
});

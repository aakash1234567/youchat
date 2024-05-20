console.log(process.env.NODE_ENV);
const Group = require("../models/Group");
const User = require("../models/User");
const Message = require("../models/Message");
const chai = require("chai");
const supertest = require("supertest");
const server = require("../server");
const jwt = require("jsonwebtoken");

const expect = chai.expect;
let token;
let groupId;

describe("Message API", () => {
  before(async () => {
    const user = await new User({
      username: "messageuser",
      password: "password123",
    }).save();
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const group = new Group({ name: "Message Group", members: [user._id] });
    return group.save().then((group) => {
      groupId = group._id;
    });
  });

  after(() => {
    return Promise.all([
      User.deleteMany({
        username: {
          $eq: "messageuser",
        },
      }),
      Group.deleteMany({
        name: {
          $eq: "Message Group",
        },
      }),
      Message.deleteMany({
        content: {
          $eq: "TEST MESSAGE",
        },
      }),
    ]);
  });

  it("should send a message", (done) => {
    supertest(server)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "TEST MESSAGE", groupId })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("content").eq("TEST MESSAGE");
        done();
      });
  });

  it("should like a message", (done) => {
    Message.findOne({ content: "TEST MESSAGE" }).then((message) => {
      supertest(server)
        .post(`/api/messages/${message._id}/like`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body)
            .to.have.property("likes")
            .to.include(message.user.toString());
          done();
        });
    });
  });
});

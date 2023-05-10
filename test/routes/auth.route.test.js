const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app");

const { expect } = chai;

chai.use(chaiHttp);

describe("User auth", () => {
  const testUser = {
    id: "666",
    username: "foo",
    password: "bar",
    preferences: { sources: [], categories: [] },
  };

  it("should register a new user", (done) => {
    chai
      .request(app)
      .post("/register")
      .send(testUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it("should not register an existing user", (done) => {
    chai
      .request(app)
      .post("/register")
      .send(testUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should login a registered user", (done) => {
    chai
      .request(app)
      .post("/login")
      .send(testUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        testUser.token = res.body.token;
        done();
      });
  });

  it("should only login an existing user", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({ username: "baz", password: "qux" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });
});

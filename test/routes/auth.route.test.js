const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

const app = require("../../src/app");

chai.use(chaiHttp);

const registerUserValid = {
  id: "666",
  username: "foo",
  password: "bar",
  preferences: {
    sources: ["bbc-news"],
    categories: ["technology", "science"],
  },
};

const registerUserInvalid = {
  id: "699",
  password: "bars",
  preferences: {
    sources: ["espn"],
    categories: ["photography"],
  },
};

const loginUserValid = {
  username: "foo",
  password: "bar",
};

const loginUserInvalidUsername = {
  username: "baz",
  password: "qux",
};

const loginUserInvalidPasswd = {
  username: "foo",
  password: "qux",
};

describe("Auth APIs", () => {
  describe("/register endpoint", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/register")
        .send(registerUserValid)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body)
            .to.have.property("message")
            .eql("Registered successfully");
          done();
        });
    });

    it("should not register an existing user", (done) => {
      chai
        .request(app)
        .post("/register")
        .send(registerUserValid)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error").eql("User already exists");
          done();
        });
    });

    it("should not register with invalid data", (done) => {
      chai
        .request(app)
        .post("/register")
        .send(registerUserInvalid)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error").eql("Invalid data");
          done();
        });
    });
  });

  describe("/login endpoint", () => {
    it("should login a registered user", (done) => {
      chai
        .request(app)
        .post("/login")
        .send(loginUserValid)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message").eql("Login successful");
          expect(res.body).to.have.property("token");
          loginUserValid.token = res.body.token;
          done();
        });
    });

    it("should not login with incorrect password", (done) => {
      chai
        .request(app)
        .post("/login")
        .send(loginUserInvalidPasswd)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("error").eql("Invalid password");
          done();
        });
    });

    it("should not login a non-existing user", (done) => {
      chai
        .request(app)
        .post("/login")
        .send(loginUserInvalidUsername)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").eql("Username not found");
          done();
        });
    });
  });
});

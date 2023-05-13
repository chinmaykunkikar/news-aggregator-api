const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

const app = require("../../src/app");
const {
  MSG_SUCCESSFUL_REGISTRATION,
  ERR_USER_EXISTS,
  MSG_SUCCESSFUL_LOGIN,
  ERR_INVALID_PASSWORD,
  ERR_USER_NOT_FOUND,
  ERR_VALIDATION,
} = require("../../src/constants/app.constants");

chai.use(chaiHttp);

const registerUserValid = {
  username: "foo",
  password: "bar",
  preferences: {
    sources: ["bbc-news"],
    categories: ["technology", "science"],
  },
};

const registerUserInvalid = {
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
            .eql(MSG_SUCCESSFUL_REGISTRATION);
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
          expect(res.body).to.have.property("error").eql(ERR_USER_EXISTS);
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
          expect(res.body).to.have.property("message").eql(ERR_VALIDATION);
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
          expect(res.body)
            .to.have.property("message")
            .eql(MSG_SUCCESSFUL_LOGIN);
          expect(res.body).to.have.property("accessToken");
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
          expect(res.body).to.have.property("error").eql(ERR_INVALID_PASSWORD);
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
          expect(res.body).to.have.property("error").eql(ERR_USER_NOT_FOUND);
          done();
        });
    });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app");
const {
  MSG_PREFERENCES_UPDATED,
  ERR_VALIDATION,
  ERR_MISSING_AUTH_HEADER,
} = require("../../src/constants/app.constants");

const { expect } = chai;

chai.use(chaiHttp);

describe("Preferences APIs", () => {
  before((done) => {
    chai
      .request(app)
      .post("/login")
      .send({ username: "foo", password: "bar" })
      .end((err, res) => {
        expect(err).to.be.null;
        accessToken = res.body.accessToken;
        done();
      });
  });

  it("should return the news preferences of the authenticated user", (done) => {
    chai
      .request(app)
      .get("/preferences")
      .set("Authorization", `JWT ${accessToken}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("categories");
        expect(res.body).to.have.property("sources");
        done();
      });
  });

  it("should update the preferences of the user", (done) => {
    chai
      .request(app)
      .put("/preferences")
      .set("Authorization", `JWT ${accessToken}`)
      .send({ categories: ["business"], sources: ["business-insider"] })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .eql(MSG_PREFERENCES_UPDATED);
        done();
      });
  });

  it("should not modify preferences with invalid category", (done) => {
    chai
      .request(app)
      .put("/preferences")
      .set("Authorization", `JWT ${accessToken}`)
      .send({ categories: ["music"], sources: ["bbc-news"] })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").eql(ERR_VALIDATION);
        done();
      });
  });

  it("should not modify preferences with invalid body", (done) => {
    chai
      .request(app)
      .put("/preferences")
      .set("Authorization", `JWT ${accessToken}`)
      .send({ categories: ["technology"] })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").eql(ERR_VALIDATION);
        done();
      });
  });

  it("should not return preferences without auth", (done) => {
    chai
      .request(app)
      .get("/preferences")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("error").eql(ERR_MISSING_AUTH_HEADER);
        done();
      });
  });

  it("should not modify preferences without auth", (done) => {
    chai
      .request(app)
      .put("/preferences")
      .send({ categories: ["business"], sources: ["bbc-news"] })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("error").eql(ERR_MISSING_AUTH_HEADER);
        done();
      });
  });
});

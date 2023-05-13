const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app");

const { expect } = chai;

chai.use(chaiHttp);

describe("News APIs", () => {
  describe("/news endpoint", () => {
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

    it("should return news articles", (done) => {
      chai
        .request(app)
        .get("/news")
        .set("Authorization", `JWT ${accessToken}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("should not return news articles without auth", (done) => {
      chai
        .request(app)
        .get("/news")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe("/news/top endpoint", () => {
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

    it("should return news articles", (done) => {
      chai
        .request(app)
        .get("/news/top")
        .set("Authorization", `JWT ${accessToken}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("should not return news articles without auth", (done) => {
      chai
        .request(app)
        .get("/news/top")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});

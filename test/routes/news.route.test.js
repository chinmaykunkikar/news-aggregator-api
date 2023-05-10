const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app");

const { expect } = chai;

chai.use(chaiHttp);

describe("News routes", () => {
  before((done) => {
    chai
      .request(app)
      .post("/login")
      .send({ username: "foo", password: "bar" })
      .end((err, res) => {
        expect(err).to.be.null;
        token = res.body.token;
        done();
      });
  });

  it("should return articles from /everything endpoint", (done) => {
    chai
      .request(app)
      .get("/news")
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should return articles from /top-headlines endpoint", (done) => {
    chai
      .request(app)
      .get("/news/top")
      .set("Authorization", `JWT ${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should not return articles without auth", (done) => {
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

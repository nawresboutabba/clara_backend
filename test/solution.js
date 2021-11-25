const superagent = require("superagent");
require("dotenv").config();
const expect = require("chai").expect;
const PORT = process.env.PORT;
const URL_SERVER = process.env.URL_SERVER;
const URL = `${URL_SERVER}:${PORT}`;
const {
  solution,
  solutionUpdated,
} = require("./fake-resources/solutions/regular");
const {user, generator} = require('./fake-resources/users/regular')

let solutionId;

let token;
describe(`Give the user ${generator.name} loged as generator`, () => {
  before ((done)=>{
    const email= generator.email
    const password = generator.password
    superagent
    .post(`${URL}/user/login`)
    .send({email, password})
    .end((error, response)=> {
      expect(response.status).to.equal(200);
      expect(response.body.token).to.not.equal(null)
      token = response.body.token
      done()
    })
  })
  describe(`when ${generator.name} inserts an idea to solve a problem`, () => {
    it("the system have to save it and response with the items saved. She's marked as idea author", (done) => {
      superagent
        .post(`${URL}/solution`)
        .auth(token, {type: "bearer"})
        .send(solution)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.status).to.equal("LAUNCHED");
          expect(response.body.active).to.equal(true);
          expect(response.body.created).to.equal(response.body.updated);
          solutionId = response.body.solutionId;
          done();
        });
    });
  });
  describe(`when ${ generator.name } update an idea description to solve a problem`, () => {
    it("then the modification made must be answered. Status 200", (done) => {
      superagent
        .patch(`${URL}/solution/${solutionId}`)
        .auth(token, {type: "bearer"})
        .send(solutionUpdated)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.description).to.equal(
            solutionUpdated.description
          );
          done();
        });
    });
  });
  describe(`when ${generator.name} decided delete a solution `, () => {
    it(`then system have to return a 204 code status`, (done) => {
      superagent
        .delete(`${URL}/solution/${solutionId}`)
        .auth(token, {type: "bearer"})
        .end((error, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
  describe(`when ${ generator.name } require a solution deleted`, () => {
    it(`then system have to return an error 404`, (done) => {
      superagent
      .get(`${URL}/solution/${solutionId}`)
      .auth(token, {type: "bearer"})
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });
  });
});

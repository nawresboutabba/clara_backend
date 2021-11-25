const superagent = require("superagent");
require("dotenv").config();
const expect = require("chai").expect;
const PORT = process.env.PORT;
const URL_SERVER = process.env.URL_SERVER;
const URL = `${URL_SERVER}:${PORT}`;
const {
  challenge,
  challengeUpdated,
} = require("./fake-resources/challenges/regular");
const { committe , generator} = require('./fake-resources/users/regular')

let challengeId;

let token;

// Session 1 - Commite
describe(`Give the user ${committe.name} loged as commite member`, () => {
  before ((done)=>{
    const email= committe.email
    const password = committe.password
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
  describe(`when ${committe.name} inserts a challenge looking for solutions`, () => {
    it("the system have to save it and response with the items saved. She's marked as idea author", (done) => {
      superagent
        .post(`${URL}/challenge`)
        .auth(token, {type: "bearer"})
        .send(challenge)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.status).to.equal("LAUNCHED");
          expect(response.body.active).to.equal(true);
          expect(response.body.updated).to.equal(undefined);
          challengeId = response.body.challengeId;
          done();
        });
    });
  });
  describe(`when ${ committe.name } update a challenge description`, () => {
    it("then the modification made must be answered. Status 200", (done) => {
      superagent
        .patch(`${URL}/challenge/${challengeId}`)
        .auth(token, {type: "bearer"})
        .send(challengeUpdated)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.description).to.equal(
            challengeUpdated.description
          );
          done();
        });
    });
  });
});

// Session 2 - Generator
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
  describe(`when ${generator.name} inserts a solution for a challenge`, () => {
    it("the system have to save it and response with the items saved. She's marked as idea author", (done) => {
      superagent
        .post(`${URL}/challenge/${challengeId}/solution`)
        .auth(token, {type: "bearer"})
        .send(challenge)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.status).to.equal("LAUNCHED");
          expect(response.body.active).to.equal(true);
          challengeId = response.body.challengeId;
          done();
        });
    });
  });
});
// Session 3 - Committe
describe(`Give the user ${committe.name} loged as generator`, () => {
  before ((done)=>{
    const email= committe.email
    const password = committe.password
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
  describe(`when ${committe.name} decide to delete a challenge `, () => {
    it(`then system have to return a 204 code status`, (done) => {
      superagent
        .delete(`${URL}/challenge/${challengeId}`)
        .auth(token, {type: "bearer"})
        .end((error, response) => {
          expect(response.status).to.equal(204);
          done();
        });
    });
  });
  describe(`when ${ committe.name } require a challenge deleted`, () => {
    it(`then system have to return an error 404`, (done) => {
      superagent
      .get(`${URL}/challenge/${challengeId}`)
      .auth(token, {type: "bearer"})
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });
  });
});

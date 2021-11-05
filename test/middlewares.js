const superagent = require('superagent')
const expect = require("chai").expect;
const PORT= 3000
const URL = `http://localhost:${PORT}`;
const regularSolution = require('./fake-resources/solutions/regular')
const Solution = require('../src/models/solutions')

let solutionId 
describe('Give an middleware that check resources', () => {
  before((done)=>{
    /*
    *  A fake-solution for testing inserted
    */
    superagent
    .post(`${URL}/solution`)
    .send(regularSolution)
    .end((error, response)=>{
      expect(response.status, `Error with POST status`).to.equal(200)
      solutionId = response.body.solutionId
      done()
    });      
  });
  after((done)=>{
    /*
    *  A fake-solution for testing inserted
    */
    superagent
    .delete(`${URL}/solution/${solutionId}`)
    .end((error, response)=>{
      expect(response.status).to.equal(201)
      done()
    });      
  })    
  describe('when a user require a solution that exist (active)', () => {
    it('then check if it exists and return it', (done) => {
          superagent
            .get(`${URL}/middleware-testing/check-resources-exist/solution/${solutionId}`)
            .end((error, response) => {
              expect(response.status).to.equal(200)
              expect(response.body.solutionId).to.equal(solutionId)
              expect(response.body.active).to.equal(true)
              done()
            })
        });
    })
});
describe('Give an middleware that check resources', () => {
    describe('when a user require a solution that does not exist (active is false)', () => {
      it('then after check must return error', (done) => {
            superagent
              .get(`${URL}/middleware-testing/check-resources-exist/solution/${solutionId}`)
              .end((error, response) => {
                expect(response.status).to.equal(404)
                done()
              })
          });
      })
  })
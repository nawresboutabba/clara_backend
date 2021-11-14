const superagent = require('superagent')
const expect = require("chai").expect;
const PORT= 3000
const URL = `http://localhost:${PORT}`
const {solution, solutionUpdated} = require('./fake-resources/solutions/regular')

let solutionId 
describe('Give an user unregister user', () => {
  describe('when he inserts an idea to solve a problem', () => {
    it('the system have to save it and response with the items saved', (done) => {
      superagent
        .post(`${URL}/solution`)
        .send( solution )
        .end((error, response) => {
          expect(response.status).to.equal(200)
          expect(response.body.status).to.equal('LAUNCHED')
          expect(response.body.active).to.equal(true)
          expect(response.body.created).to.equal(response.body.updated)
          solutionId = response.body.solutionId
          done()
        })
    });
  })
  describe('when he update an idea description to solve a problem', () => {
    it('then the modification made must be answered. Status 200', (done)=>{
        superagent
        .patch(`${URL}/solution/${solutionId}`)
        .send(solutionUpdated)
        .end((error, response) => {
            expect(response.status).to.equal(200)
            expect(response.body.description).to.equal(solutionUpdated.description)
            done()
          })
    });
  })
  describe('when a solution is deleted', () => {
    it('then system have to return a 201 code status', (done)=>{
        superagent
        .delete(`${URL}/solution/${solutionId}`)
        .end((error, response) => {
            expect(response.status).to.equal(201)
            done()
          })
    });
  })
  describe('when a solution deleted is required', () => {
    it('then system have to return an error 404', (done)=>{
        superagent
        .get(`${URL}/solution/${solutionId}`)
        .end((error, response) => {
            expect(response.status).to.equal(404)
            done()
          })
    });
  })
})
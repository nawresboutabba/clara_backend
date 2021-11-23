const superagent = require('superagent')
require('dotenv').config();
const expect = require("chai").expect;
const PORT= process.env.PORT
const URL_SERVER=process.env.URL_SERVER
const URL = `${URL_SERVER}:${PORT}`
const { user } = require('./fake-resources/users/regular')

let userId 
describe('Give an unregister user', () => {
  describe('when signup', () => {
    it('then the system have to save it and return data registration', (done) => {
      superagent
        .post(`${URL}/user/signup`)
        .send( user )
        .end((error, response) => {
          expect(response.status).to.equal(200)
          expect(response.body.email).to.equal(user.email)
          expect(response.body.userId).to.not.equal(null)
          expect(response.body.workSpace).to.have.all.members(["ABSOLUTE"])
          userId = response.body.userId
          done()
        })
    });
  });
});
describe('Give an registered user', () => {
    describe('when signup', () => {
      it('then the system have return error because user exist', (done) => {
        superagent
          .post(`${URL}/user/signup`)
          .send( user )
          .end((error, response) => {
            expect(response.status).to.equal(409)
            done()
          })
      });
    });
    describe('when delete himself', ()=> {
      it('then the system have delete him and return the confirmation', (done) => {
        superagent
        .delete(`${URL}/user/${userId}`)
        .end((error, response)=> {
          expect(response.status).to.equal(204)
          done()
        })
      })
    })
  })
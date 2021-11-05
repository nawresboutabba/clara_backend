const superagent = require('superagent')
const expect = require("chai").expect;
const PORT= 3000
const URL = `http://localhost:${PORT}`
const Solution = require('../src/models/solutions')

let solutionId 
describe('Dado una solucion', () => {
  describe('cuando el usuario inserte los datos', () => {
    it('debe devolver un POST', (done) => {
        console.log('Primero')
      superagent
        .post(`${URL}/solution`)
        .send({description:"wep"})
        .end((error, response) => {
          expect(response.status).to.equal(200)
          solutionId = response.body.solutionId
          console.log(`solutionId is: ${solutionId}`)
          done()
        })
    });
  })
  describe('cuando el usuario decida eliminar', () => {
    it('se debe responder un delete', (done)=>{
        console.log('Segundo')
        superagent
        .delete(`${URL}/solution/${solutionId}`)
        .end((error, response) => {
            expect(response.status).to.equal(201)
            done()
          })
    });
  })
  describe('cuando el usuario quiera recuperar una eliminada', () => {
    it('se debe indicar que no se encuentra el recurso', (done)=>{
        console.log('Tercero')
        superagent
        .get(`${URL}/solution/${solutionId}`)
        .end((error, response) => {
            expect(response.status).to.equal(404)
            done()
          })
    });
  })
})
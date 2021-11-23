'use strict';
const _ = require('lodash');
const Solution = require('../models/solutions');
const { HTTP_RESPONSE } = require('@root/src/constants')

/**
 * @description Verify that resources in the params bag exist in Mongo. If they are found, then the data
 *              is attached to req.resources bag. If they are not found or an error occurs, response headers are set
 *               with the proper error code status.
 * @param collection A collection where is the document required.
 * @returns {Express.Middleware}
 *
 * @example
 * router.get('/solution/:solutionId',[
 *     checkResourceExistFromParams('solutions')
 * ], (req,res,next)=> {
 *     req.resources.solution
 *
  })
 */

function checkResourceExistFromParams(collection) {
    return async function middleware(req, res, next) {
      req.resources = {};
      let resp = {}
      let index 
      try {
        if(collection === 'solutions'){
          const solutionId = req.params.solutionId
          resp = await Solution.getSolutionActiveById(solutionId)
          index = 'solution'
        } 
        if(_.isEmpty(resp)){
          throw new Error(HTTP_RESPONSE._404);
        }
        // @TODO add camel case convertion
        req.resources[index] = resp

        next();
      } catch (err) {
        res.status(404)
        next(err)
      }
    };
  }
  
  module.exports = checkResourceExistFromParams;
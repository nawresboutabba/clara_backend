'use strict';
const _ = require('lodash');
const Solution = require('../models/solutions')

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
          resp = await Solution.findOne(req.params, {_id: 0})
          index = 'solution'
        } 

        if(_.isEmpty(resp)){
          throw new Error('Error while checking resource exists.');
        }
/*         const Collection = mongoose.model(collection, new Solution({}))
        const resp = Collection
        .findOne(req.params)
        .then(resp=>{
          return resp
        })
        .catch(err=>{
          console.log(err)
        })
 */
        req.resources[index] = resp
        return next();
      } catch (err) {
          res
          .status(500)
          .json({
            error: {
              code: 500,
              message: `There was a problem trying to locate the resource. ${err}`,
            }
          })
          .send()
          return next()
      }
    };
  }
  
  module.exports = checkResourceExistFromParams;
"use strict";

import { NextFunction } from "express";
import SolutionService from "../services/Solution.service";
import ChallengeService from '../services/Challenge.service';
import  { ERRORS, RESOURCE }  from "../constants";
import { RequestMiddleware, ResponseMiddleware } from "./middlewares.interface";
import RoutingError from "../handle-error/error.routing";

const _ = require("lodash");
const { HTTP_RESPONSE } = require("@root/src/constants");

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

/**
 * 
 * @param collection DEPRECATED
 * @returns 
 */
/**
 * 
 * @param collection DEPRECATED
 * @returns 
 */
/**
 * 
 * @param collection DEPRECATED
 * @returns 
 */
function checkResourceExistFromParams(collection:string) {
	return async function middleware(req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) {
		req.resources = {};
		let resp = {};
		let index: any ;
		try {
			if (collection === "solutions") {
				const solutionId = req.params.solutionId;
				// @TODO create lightning get resource 
				resp = await SolutionService.getSolutionActiveById(solutionId);
				index = RESOURCE.SOLUTION;
			}
			if (collection === 'challenges'){
				const challengeId = req.params.challengeId
				// @TODO create lightning get resource 
				resp = await ChallengeService.getChallengeActiveById(challengeId)
				index = RESOURCE.CHALLENGE
			}

			if (_.isEmpty(resp)) {
				const customError = new RoutingError(ERRORS.ROUTING.CHECK_RESOURCE, HTTP_RESPONSE._404)
				throw customError;
			}
			// @TODO add camel case convertion
			req.resources[index] = resp;

			next();
		} catch (err) {
			next(err);
		}
	};
}

export default checkResourceExistFromParams;

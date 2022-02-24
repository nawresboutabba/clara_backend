import { ERRORS, HTTP_RESPONSE, PARTICIPATION_MODE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { SolutionI } from "../../models/situation.solutions";
import { TeamI } from "../../models/team";
import { UserI } from "../../models/users";
import SolutionService from "../../services/Solution.service";
import TeamService from "../../services/Team.service";
import UserService from "../../services/User.service";

export function CAN_EDIT_SOLUTION (req: RequestMiddleware): Promise<void> {
	return new Promise(async (resolve, reject)=> {
		try{
			const solution: SolutionI = await SolutionService.getSolutionActiveById(req.params.solutionId)
			if(solution){
				req.resources = {...req.resources, solution}
			}else {
				return reject(
					new RoutingError(
						ERRORS.ROUTING.SOLUTION_FORBIDDEN,
						HTTP_RESPONSE._400
					)
				)
			}
			const user: UserI = await UserService.getUserActiveByUserId(req.user.userId)
          
			if (PARTICIPATION_MODE.INDIVIDUAL_WITH_COAUTHORSHIP){
				if (user.userId == solution.author.userId){
					/**
                     * Check that user is author of solution
                     */
					return resolve()
				}else if(solution.coauthor.includes(user)){
					/**
                     * Check that user is coauthor of solution
                     */
					return resolve()
				}else {
					return reject(
						new RoutingError(
							ERRORS.ROUTING.SOLUTION_FORBIDDEN,
							HTTP_RESPONSE._500
						)
					)
				}
			}else if(PARTICIPATION_MODE.TEAM){
				const teams:TeamI [] = await TeamService.getTeamsUser(user)
				if(teams.includes(solution.team)){
					return resolve()
				}else{
					return reject(
						new RoutingError(
							ERRORS.ROUTING.SOLUTION_FORBIDDEN,
							HTTP_RESPONSE._500
						)
					)
				}
			}else {
				return reject(new RoutingError(
					ERRORS.ROUTING.PARTICIPATION_MODE_NOT_AVAILABLE,
					HTTP_RESPONSE._500
				))
			}
		}catch(error){
			return reject(error)
		}
	})
}
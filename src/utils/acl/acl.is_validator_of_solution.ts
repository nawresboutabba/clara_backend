import { BAREMO_TYPE, ERRORS, HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { SolutionI } from "../../models/situation.solutions";
import IntegrantService from "../../services/Integrant.service";
import SolutionService from "../../services/Solution.service";

export async function IS_VALIDATOR_OF_SOLUTION (req: RequestMiddleware): Promise<void> {
  try{
    const solution: SolutionI = await SolutionService.getSolutionActiveById(req.params.solutionId)
    if (!(req.resources?.solution)){
      if(!solution){
        return Promise.reject(new RoutingError(
          ERRORS.ROUTING.SOLUTION_FORBIDDEN,
          HTTP_RESPONSE._500
        ))                    
      }
      req.resources = {... req.resources, solution}
    }
    if(!solution?.groupValidator){
      throw "This user is not validator assigned for this solution"
    }
    const groupValidator = solution.groupValidator
    const integrantsGroupValidator = await IntegrantService.getIntegrantsOfGroupValidator(groupValidator)
    const user = integrantsGroupValidator.filter(integrant => integrant.user.userId == req.user.userId)
    if(user.length>0){
      const baremoType = BAREMO_TYPE.TEAM_VALIDATOR
      req.utils = {... req.utils, baremoType}
      return Promise.resolve()
    }
    throw "This user is not validator assigned for this solution"
  }catch(error){
    return Promise.reject(error)
  }
}
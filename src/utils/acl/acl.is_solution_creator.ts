import { ERRORS, HTTP_RESPONSE } from "../../constants"
import RoutingError from "../../handle-error/error.routing"
import { RequestMiddleware } from "../../middlewares/middlewares.interface"
import { SolutionI } from "../../models/situation.solutions"
import SolutionService from "../../services/Solution.service"

export async function IS_SOLUTION_CREATOR(req: RequestMiddleware): Promise<void>{
  try{
    const solution: SolutionI = await SolutionService.getSolutionActiveById(req.params.solutionId)
    if (!(req.resources?.solution)){
      if(solution == null){
        return Promise.reject(new RoutingError(
          ERRORS.ROUTING.OPERATION_NOT_AVAILABLE,
          HTTP_RESPONSE._500
        ))          
      }
      req.resources = {... req.resources, solution}
      if(req.user.userId == solution.author.userId){
        return Promise.resolve()
      }    
    }
    return Promise.reject(new RoutingError(
      ERRORS.ROUTING.OPERATION_NOT_AVAILABLE,
      HTTP_RESPONSE._500
    ))
  }catch(error){
    return Promise.reject(error)
  }
}
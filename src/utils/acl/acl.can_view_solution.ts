import { ERRORS, HTTP_RESPONSE, WSALEVEL } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { SolutionI } from "../../models/situation.solutions";
import SolutionService from "../../services/Solution.service";
import * as _ from 'lodash'; 
import { IntegrantStatusI } from "../../models/integrant";
import { isCommitteMember } from "./function.is_committe_member";

export async function CAN_VIEW_SOLUTION (req: RequestMiddleware) : Promise<void>{
  try{
    const solution: SolutionI = await SolutionService.getSolutionActiveById(req.params.solutionId)
    if (!(req.resources?.solution)){
      if(solution == null){
        return Promise.reject(new RoutingError(
          ERRORS.ROUTING.SOLUTION_DOES_NOT_EXIST,
          HTTP_RESPONSE._500
        ))                    
      }
      req.resources = {... req.resources, solution}
    }
    const user = req.user
    /**
     * Check if user is committe member. If user is committe member, then can view solution
     */
    const committe: IntegrantStatusI = await isCommitteMember(req.user)

    if(committe.isActive){
      return Promise.resolve()
    }

    /**
     * If user is not committe member, then analysis continue
     */
    if (user.externalUser){
      /**
        * Temporaly: Return error if a external User want to see a challenge
        * @TODO create a whitelist for manage external users
        */
      return Promise.reject(new RoutingError(
        ERRORS.ROUTING.SOLUTION_FORBIDDEN,
        HTTP_RESPONSE._500
      ))
    } else {
      if (req.resources.solution.WSALevelChosed == WSALEVEL.AREA){
        const userAreaVisible = user.areaVisible.filter((area)=> {return area.areaId})
        const solutionAreasAvailable = req.resources.solution.areasAvailable.filter((area)=> {return area.areaId})
        const intersection = _.intersection(solutionAreasAvailable, userAreaVisible)
    
        if (intersection.length > 0){
          return Promise.resolve()
        }
        return Promise.reject(new RoutingError(
          ERRORS.ROUTING.SOLUTION_FORBIDDEN,
          HTTP_RESPONSE._500
        ))
      }else{
        /**
          * Challenge WSALevel = "COMPANY"
          */
        return Promise.resolve()
      }
    }
  }catch(error){
    return Promise.reject(error)
  }
}
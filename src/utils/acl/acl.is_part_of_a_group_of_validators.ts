import { COMMITTE_ROLE, ERRORS, HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { IntegrantStatusI } from "../../models/integrant";
import IntegrantService from "../../services/Integrant.service";
import { isCommitteMember } from "./function.is_committe_member";

/**
 * Check that user is part of team validator
 * @param req
 * @returns 
 */
export async function IS_PART_OF_GROUP_VALIDATOR (req: RequestMiddleware): Promise<void> {
  try{
    const committe: IntegrantStatusI = await isCommitteMember(req.user)
    if (committe.isActive && committe.role === COMMITTE_ROLE.GENERAL){
      const integrant = await IntegrantService.getIntegrantByUser(req.user)
      const groupValidator = integrant.groupValidator
      if (groupValidator){
        req.utils = {...req.utils, groupValidator}
        req.query.groupValidatorId = groupValidator.groupValidatorId
        return Promise.resolve()
      }else{
        throw (new RoutingError(
          ERRORS.ROUTING.OPERATION_NOT_AVAILABLE,
          HTTP_RESPONSE._500,
        ))
      }
    }
    throw new RoutingError(
      ERRORS.ROUTING.OPERATION_NOT_AVAILABLE,
      HTTP_RESPONSE._500,
    )
  }catch(error){
    return Promise.reject(error)
  }
}
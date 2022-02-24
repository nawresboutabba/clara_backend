import { ERRORS, HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { IntegrantStatusI } from "../../models/integrant";
import { isCommitteMember } from "./function.is_committe_member";

export function IS_COMMITTE_MEMBER(req: RequestMiddleware):Promise<void>{
  return new Promise(async (resolve, reject)=> {
    try{
      const committe: IntegrantStatusI = await isCommitteMember(req.user)

      if(committe.isActive){
        return resolve()
      }
      return reject(new RoutingError(
        ERRORS.ROUTING.OPERATION_NOT_AVAILABLE,
        HTTP_RESPONSE._500
      ))
    }catch(error){
      return reject(error)
    }
  })
}
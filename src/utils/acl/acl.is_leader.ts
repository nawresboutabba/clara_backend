import { ERRORS, HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import IntegrantService from "../../services/Integrant.service";

export function IS_LEADER(req: RequestMiddleware): Promise<void>{
	return new Promise(async (resolve, reject)=> {
		try{
			const currentLeader = await IntegrantService.currentLeader() 
			if(req.user.userId == currentLeader?.user?.userId){
				return resolve()
			}

			throw new RoutingError(
				ERRORS.ROUTING.OPERATION_NOT_AVAILABLE,
				HTTP_RESPONSE._500
			)
		}catch(error){
			return reject(error)
		}
	})
}
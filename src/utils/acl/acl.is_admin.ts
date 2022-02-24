import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { ERRORS, HTTP_RESPONSE, OWNER } from "../../constants";
import RoutingError from "../../handle-error/error.routing";

export function IS_ADMIN(req: RequestMiddleware): Promise<void>{
	return new Promise((resolve, reject)=> {
		try{
			if(req.user.email === OWNER){
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
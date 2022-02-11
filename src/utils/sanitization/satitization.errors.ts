import { HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";

export function throwSanitizatorErrors(validationResult: Function, req: RequestMiddleware, routingError: string):Promise<void>{
    return new Promise((resolve, reject)=> {
        try{
            const errors = validationResult(req).array();
            if (errors.length > 0) {
              const customError = new RoutingError(
                routingError,
                HTTP_RESPONSE._400,
                errors
                )
              return reject( customError);
            }
            return resolve()
        }catch(error){
            return reject(error)
        }
    })
}

import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../middlewares/middlewares.interface";
import RoutingError from "./error.routing";
import RepositoryError from "./error.repository";
import ServiceError from "./error.service";

export const logError = (err: any,req: RequestMiddleware,res:ResponseMiddleware,next: NextFunction):void => {
    let error: ServiceError | RepositoryError | RoutingError

    error = err

    /**
     * @TODO Serialize Body and Params
     */
    console.error(`Log Error.StatusCode:${error.code}.Description ${error.name}. Layer: ${error.layer} Stack: ${error.stack}. Body: ${req.body}. Params: ${req.params}`);
    next(error);
}
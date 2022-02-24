import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../middlewares/middlewares.interface";
import RepositoryError from "./error.repository";
import RoutingError from "./error.routing";
import ServiceError from "./error.service";

export const errorHandler=(err: any, req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction):void => {
	const error : ServiceError | RepositoryError | RoutingError = err
	if (res.statusCode == 200){
		/**
         * If error is not setting, then theow 500 by default
         */
		const code: number = error.code || 500
		res.status(code)
	}
	res
		.json({ error: err })
		.send();
}
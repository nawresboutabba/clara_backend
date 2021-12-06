import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../middlewares/middlewares.interface";

export const logError = (err: Error,req: RequestMiddleware,res:ResponseMiddleware,next: NextFunction):void => {
    if (res.statusCode == 200){
        res.status(500)
    }
    console.error(`Log Error.StatusCode:${res.statusCode}.Description ${err}`);
    next(err);
}
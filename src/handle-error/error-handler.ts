import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../middlewares/middlewares.interface";

export const errorHandler=(err: Error, req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction):void => {
    res
    .json({ error: err })
    .send();
}
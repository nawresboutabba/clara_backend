import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../middlewares/middlewares.interface";

export const errorHandler=(err: Error, req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction):void => {
    /**
     * @TODO fix sanitizator's errors messages
     */
    res
    .json({ error: err })
    .send();
}
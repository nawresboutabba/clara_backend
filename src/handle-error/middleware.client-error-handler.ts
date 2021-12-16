import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../middlewares/middlewares.interface";

export const clientErrorHandler = (err: Error, req: RequestMiddleware, res:ResponseMiddleware, next:NextFunction):void => {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' });
    } else {
      next(err);
    }
  }
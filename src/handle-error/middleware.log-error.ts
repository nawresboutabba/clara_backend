import { NextFunction } from "express";
import {
  RequestMiddleware,
  ResponseMiddleware,
} from "../middlewares/middlewares.interface";
import RoutingError from "./error.routing";
import RepositoryError from "./error.repository";
import ServiceError from "./error.service";

export const logError = (
  error: Error,
  req: RequestMiddleware,
  res: ResponseMiddleware,
  next: NextFunction
): void => {
  /**
   * @TODO Serialize Body and Params
   */
  const convertedErr = error as unknown as
    | ServiceError
    | RepositoryError
    | RoutingError;
  console.error(
    `Log Error.StatusCode:${convertedErr.code}.Description ${convertedErr.name}. Layer: ${convertedErr.layer} Stack: ${convertedErr.stack}. Body: ${req.body}. Params: ${req.params}`
  );
  next(error);
};

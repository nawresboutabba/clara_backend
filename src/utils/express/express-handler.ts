import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodSchema } from "zod";
import { UserI } from "../../models/users";

type ValidatedMiddleware<TBody, TQuery, TParams> = (
  req: Request<TParams, unknown, TBody, TQuery> & {
    user: UserI;
  },
  res: Response,
  next: NextFunction
) => unknown;

type SchemaDefinition<TBody, TQuery, TParams> = Partial<{
  body: ZodSchema<TBody>;
  query: ZodSchema<TQuery>;
  params: ZodSchema<TParams>;
}>;

const check = <TType>(
  obj?: unknown,
  schema?: ZodSchema<TType>
): obj is TType => {
  if (!schema) {
    return true;
  }
  return schema.safeParse(obj).success;
};

export const validate = <TBody = unknown, TQuery = unknown, TParams = unknown>(
  schema: SchemaDefinition<TBody, TQuery, TParams>,
  middleware: ValidatedMiddleware<TBody, TQuery, TParams>
): RequestHandler => {
  return async (req, res, next) => {
    if (
      check(req.body, schema.body) &&
      check(req.query, schema.query) &&
      check(req.params, schema.params)
    ) {
      try {
        return await middleware(
          req as unknown as Request<TParams, unknown, TBody, TQuery> & {
            user: UserI;
          },
          res,
          next
        );
      } catch (err) {
        next(err);
      }
    }

    if (schema.body) {
      const result = schema.body.safeParse(req.body, { path: ["body"] });
      if (result.success === false) {
        return next(result.error);
      }
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query, { path: ["query"] });
      if (result.success === false) {
        return next(result.error);
      }
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params, { path: ["params"] });
      if (result.success === false) {
        return next(result.error);
      }
    }

    return next(new Error("zod-express-guard could not validate this request"));
  };
};

export const validateBody = <TBody>(
  body: ZodSchema<TBody>,
  middleware: ValidatedMiddleware<TBody, unknown, unknown>
) => validate({ body }, middleware);

export const validateQuery = <TQuery>(
  query: ZodSchema<TQuery>,
  middleware: ValidatedMiddleware<unknown, TQuery, unknown>
) => validate({ query }, middleware);

export const validateParams = <TParams>(
  params: ZodSchema<TParams>,
  middleware: ValidatedMiddleware<unknown, unknown, TParams>
) => validate({ params }, middleware);

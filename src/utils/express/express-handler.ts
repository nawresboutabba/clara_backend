import { NextFunction, Request, RequestHandler, Response } from "express";
import { ServerResponse } from "http";
import { SafeParseSuccess, ZodSchema, ZodTypeAny } from "zod";
import { UserI } from "../../models/users";

type ValidatedMiddleware<TBody, TQuery, TParams> = (
  req: Request<TParams, unknown, TBody, TQuery> & {
    user: UserI;
  },
  res: Response,
  next: NextFunction
) => Promise<unknown> | void;

type SchemaDefinition<TBody, TQuery, TParams> = Partial<{
  body: ZodSchema<TBody>;
  query: ZodSchema<TQuery>;
  params: ZodSchema<TParams>;
}>;

const check = <T extends ZodTypeAny>(obj?: unknown, schema?: T) => {
  if (!schema) {
    return { success: true, data: true } as SafeParseSuccess<true>;
  }
  return schema.safeParse(obj);
};

export const validate = <TBody = unknown, TQuery = unknown, TParams = unknown>(
  schema: SchemaDefinition<TBody, TQuery, TParams>,
  middleware: ValidatedMiddleware<TBody, TQuery, TParams>
): RequestHandler => {
  return async (req, res, next) => {
    const bodyParsed = check(req.body, schema.body);
    const queryParsed = check(req.query, schema.query);
    const paramsParsed = check(req.params, schema.params);

    if (bodyParsed.success && queryParsed.success && paramsParsed.success) {
      try {
        const result = await middleware(
          req as unknown as Request<TParams, unknown, TBody, TQuery> & {
            user: UserI;
          },
          res,
          next
        );
        if (result && !(result instanceof ServerResponse)) {
          return res.json(result);
        }
        return result;
      } catch (err) {
        next(err);
      }
    }

    if (bodyParsed.success === false) {
      return next(bodyParsed.error);
    }

    if (queryParsed.success === false) {
      return next(queryParsed.error);
    }

    if (paramsParsed.success === false) {
      return next(paramsParsed.error);
    }

    // schema.body?.parse(req.body);
    // schema.query?.parse(req.query);
    // schema.params?.parse(req.params);
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

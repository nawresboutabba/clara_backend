import { z } from "zod";

export function booleanSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((arg) => {
    if (typeof arg == "string") {
      return arg === "true";
    }
    if (arg instanceof Boolean) {
      return arg;
    }
  }, schema);
}

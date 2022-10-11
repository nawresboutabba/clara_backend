import { z } from "zod";

export function numberSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Number) {
      return Number(arg);
    }
  }, schema);
}

import { z } from "zod";

export function dateSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) {
      return new Date(arg);
    }
  }, schema);
}
// export type DateSchema = z.infer<typeof dateSchema>;

import { z } from "zod";

export const sortSchema = z.union([
  z.literal(-1),
  z.literal(1),
  z.literal("asc"),
  z.literal("ascending"),
  z.literal("desc"),
  z.literal("descending"),
]);

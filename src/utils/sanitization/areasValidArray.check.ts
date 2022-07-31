import { query } from "express-validator";
import AreaService from "../../services/Area.service";

export function areasValidArray(field = "departmentAffected") {
  return query(field)
    .isArray()
    .optional()
    .custom(async (value: string[], { req }): Promise<void> => {
      try {
        if (value.length === 0) {
          return;
        }

        const areas = await AreaService.getAreasById(value);

        if (areas.length == value.length) {
          req.utils = { areas, ...req.utils };
          return;
        }
        throw new Error("areas does not valid");
      } catch (error) {
        throw new Error("areas does not valid");
      }
    });
}

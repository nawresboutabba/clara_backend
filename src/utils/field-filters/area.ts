import { AreaResponse } from "../../controller/area/area";
import { AreaI } from "../../models/organization.area";

/**
 * Area information filter.
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interfece that finalize with "Response". For example UserResponse interface
 * @param area
 * @returns
 */
export function genericAreaFilter({ areaId, name }: AreaI): AreaResponse {
  return {
    area_id: areaId,
    name,
  };
}

export function genericArrayAreaFilter(
  area: Array<AreaI>
): Array<AreaResponse> {
  if (!area) {
    return [];
  }
  return area.map(genericAreaFilter);
}

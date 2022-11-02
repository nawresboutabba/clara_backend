import { Area } from "./area.model";

export function getAreasByIds(areasIds: string[]) {
  return Area.find({ id: { $in: areasIds } });
}

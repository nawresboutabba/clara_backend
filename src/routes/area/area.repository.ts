import { Area } from "./area.model";

export function getAreasByIds(areasIds: string[]) {
  return Area.find({ _id: { $in: areasIds } });
}

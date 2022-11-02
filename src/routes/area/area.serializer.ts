import { AreaI } from "./area.model";

export function genericAreaSerializer(area: AreaI) {
  return area;
}

export function genericArrayAreaFilter(area: Array<AreaI>) {
  return area.map(genericAreaSerializer);
}

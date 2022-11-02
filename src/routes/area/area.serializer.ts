import { AreaI } from "./area.model";

export function genericAreaSerializer(area: AreaI) {
  return {
    id: area._id,
    name: area.name,
  };
}

export type AreaSerialized = ReturnType<typeof genericAreaSerializer>;

export function genericArrayAreaFilter(area: Array<AreaI>) {
  return area.map(genericAreaSerializer);
}

import { UpdateQuery } from "mongoose";
import Barema, { BaremaI } from "./barema.model";

export function getBaremaById(baremaId: string) {
  return Barema.findById(baremaId)
    .populate("insertedBy")
    .populate("archivedBy");
}

export function updateBaremaPartially(
  baremaId: string,
  data: UpdateQuery<BaremaI>
) {
  return Barema.findByIdAndUpdate(baremaId, data, { new: true })
    .populate("insertedBy")
    .populate("archivedBy");
}

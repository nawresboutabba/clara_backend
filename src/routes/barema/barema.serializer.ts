import { genericUserFilter } from "../../utils/field-filters/user";
import { BaremaI } from "./barema.model";

export async function baremaSerializer(barema: BaremaI) {


  return {
    id: barema.id,

    title: barema.title,
    description: barema.description,
    valueKind: barema.valueKind,
    weight: barema.weight,
    type: barema.type,
    axis: barema.axis,

    inserted_by: await genericUserFilter(barema.insertedBy),
    archived_by: barema.archivedBy ? await genericUserFilter(barema.archivedBy) : null,

    createdAt: barema.createdAt,
    updatedAt: barema.updatedAt,
  };
}

export async function listBaremaSerializer(baremas: BaremaI[]) {
  return Promise.all(baremas.map(baremaSerializer))
}

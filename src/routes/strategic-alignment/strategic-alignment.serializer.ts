import { UserResponse } from "../../controller/users";
import { genericUserFilter } from "../../utils/field-filters/user";
import { StrategicAlignmentI } from "./strategic-alignment.model";

export interface StrategicAlignmentSerialized {
  id: string;
  description: string;
  inserted_by: UserResponse;
  start_active: Date;
  end_active: Date;
  created_at: Date;
  updated_at: Date;
}

export async function alignmentSerializer(
  alignment: StrategicAlignmentI
): Promise<StrategicAlignmentSerialized> {
  const inserted_by = await genericUserFilter(alignment.insertedBy);

  return {
    id: alignment.id,
    description: alignment.description,
    inserted_by,
    start_active: alignment.startActive,
    end_active: alignment.endActive,
    created_at: alignment.createdAt,
    updated_at: alignment.updatedAt,
  };
}

export function listAlignmentSerializer(tags: StrategicAlignmentI[]) {
  return Promise.all(tags.map(alignmentSerializer));
}

export interface LightStrategicAlignmentSerialized {
  id: string;
  description: string;
  start_active: Date;
  end_active: Date;
  created_at: Date;
  updated_at: Date;
}

export function lightAlignmentSerializer(
  alignment: StrategicAlignmentI
): LightStrategicAlignmentSerialized {
  return {
    id: alignment.id,
    description: alignment.description,
    start_active: alignment.startActive,
    end_active: alignment.endActive,
    created_at: alignment.createdAt,
    updated_at: alignment.updatedAt,
  };
}

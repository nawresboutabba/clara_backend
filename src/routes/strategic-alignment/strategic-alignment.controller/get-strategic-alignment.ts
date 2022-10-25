import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import { StrategicAlignment } from "../strategic-alignment.model";
import { listAlignmentSerializer } from "../strategic-alignment.serializer";

export const getStrategicAlignment = validate(
  {
    query: z
      .object({
        active: z.boolean(),
      })
      .partial(),
  },
  async ({ query: { active } }) => {
    const alignments = await StrategicAlignment.find(
      Object.assign(
        {},
        active
          ? { $or: [{ archivedAt: { $eq: null } }, { endActive: { $gt: new Date() } }] }
          : { $or: [{ archivedAt: { $ne: null } }, { endActive: { $lt: new Date() } },] }
      )
    ).populate("insertedBy");

    return listAlignmentSerializer(alignments);
  }
);

import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { removeEmpty } from "../../../utils/general/remove-empty";
import { sortSchema } from "../../../utils/params-query/sort.query";
import Barema, { BaremaAxis, BaremaValueKind } from "../barema.model";
import { listBaremaSerializer } from "../barema.serializer";

export const getBaremas = validate(
  {
    query: z.object({
      valueKind: BaremaValueKind.optional(),
      axis: BaremaAxis.optional(),

      active: z.boolean().default(true),

      init: z.number().default(0),
      offset: z.number().default(10),
      sort: z
        .object({ title: sortSchema, createdAt: sortSchema })
        .partial()
        .default({ createdAt: -1 }),
    }),
  },
  async ({ user, query }, res) => {
    const committee = await isCommitteeMember(user);

    if (!committee.isActive) {
      return res.status(403).json({ message: "not authorized" });
    }

    const baremas = await Barema.find(
      removeEmpty(
        Object.assign(
          { valueKind: query.valueKind, axis: query.axis },
          query.active
            ? { archivedAt: { $eq: null }, endActive: { $gt: new Date() } }
            : { $or: [{ archivedAt: { $ne: null } }, { endActive: { $lt: new Date() } }] }
        )
      )
    )
      .populate("insertedBy")
      .populate("archivedAt")
      .skip(query.init)
      .limit(query.offset)
      .sort(query.sort);

    return listBaremaSerializer(baremas);
  }
);

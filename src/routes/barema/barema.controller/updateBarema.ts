import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import {
  BaremaAxis,
  BaremaType,
  BaremaValueKind
} from "../barema.model";
import { getBaremaById, updateBaremaPartially } from "../barema.repository";
import { baremaSerializer } from "../barema.serializer";

export const updateBarema = validate(
  {
    params: z.object({ baremaId: z.string() }),
    body: z.object({
      title: z.string(),
      description: z.string(),
      valueKind: BaremaValueKind,
      weight: z.number(),
      type: BaremaType,
      axis: BaremaAxis,
    }).partial(),
  },
  async ({ user, body, params: { baremaId } }, res) => {
    const committee = await isCommitteeMember(user);

    if (!committee.isActive) {
      return res.status(403).json({ message: "not authorized" });
    }

    const barema = await getBaremaById(baremaId);

    if (barema === null) {
      return res
        .status(404)
        .json({ message: `barema(${baremaId}) not exists` });
    }

    const updatedBarema = await updateBaremaPartially(baremaId, body);

    return baremaSerializer(updatedBarema);
  }
);

import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { getBaremaById, updateBaremaPartially } from "../barema.repository";
import { baremaSerializer } from "../barema.serializer";

export const archiveBarema = validate(
  {
    params: z.object({ baremaId: z.string() }),
  },
  async ({ user, params: { baremaId } }, res) => {
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

    const updatedBarema = await updateBaremaPartially(baremaId, {
      $set: {
        archivedAt: barema.archivedAt ? null : new Date(),
        archivedBy: barema.archivedAt ? null : user,
      },
    });

    return baremaSerializer(updatedBarema);
  }
);

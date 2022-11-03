import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { StrategicAlignment } from "../strategic-alignment.model";
import { alignmentSerializer } from "../strategic-alignment.serializer";

export const archiveStrategicAlignment = validate(
  {
    params: z.object({ strategicAlignmentId: z.string() }),
  },
  async ({ user, params: { strategicAlignmentId } }, res) => {
    const committee = await isCommitteeMember(user);
    if (!committee.isActive) {
      return res
        .status(403)
        .json({ message: "just committee members can access" });
    }

    const alignment = await StrategicAlignment.findById(strategicAlignmentId);

    const updatedAlignment = await StrategicAlignment.findByIdAndUpdate(
      strategicAlignmentId,
      {
        $set: {
          archivedAt: alignment.archivedAt ? null : new Date(),
          archivedBy: alignment.archivedAt ? null : user,
        },
      },
      { new: true }
    ).populate("insertedBy");

    return res.status(201).json(await alignmentSerializer(updatedAlignment));
  }
);

import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { StrategicAlignment } from "../strategic-alignment.model";
import { alignmentSerializer } from "../strategic-alignment.serializer";

export const archiveStrategicAlignment = validate({
  query: z.object({ strategicAlignmentId: z.string() }),
}, async ({ user, query: { strategicAlignmentId } }, res) => {
  const committee = await isCommitteeMember(user);
  if (!committee.isActive) {
    return res.status(403).json({ message: "just committee members can access" })
  }

  const updatedAlignment = await StrategicAlignment.findByIdAndUpdate(strategicAlignmentId, {
    $set: {
      archivedAt: new Date()
    }
  }, { new: true })
    .populate("insertedBy")

  return res.status(201).json(await alignmentSerializer(updatedAlignment));
})

import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { dateSchema } from "../../../utils/zod";
import { StrategicAlignment } from "../strategic-alignment.model";
import { alignmentSerializer } from "../strategic-alignment.serializer";

export const updateStrategicAlignment = validate(
  {
    params: z.object({ strategicAlignmentId: z.string() }),
    body: z.object({
      description: z.string(),
      start_active: dateSchema(z.date()),
      end_active: dateSchema(z.date()),
    }),
  },
  async ({ user, body, params: { strategicAlignmentId } }, res) => {
    const committee = await isCommitteeMember(user);
    if (!committee.isActive) {
      return res
        .status(403)
        .json({ message: "just committee members can access" });
    }

    const updatedAlignment = await StrategicAlignment.findByIdAndUpdate(
      strategicAlignmentId,
      {
        startActive: body.start_active,
        endActive: body.end_active,
        description: body.description,
      },
      { new: true }
    ).populate("insertedBy");

    return res.status(201).json(await alignmentSerializer(updatedAlignment));
  }
);

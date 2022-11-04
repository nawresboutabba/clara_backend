import { z } from "zod";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { validate } from "../../../utils/express/express-handler";
import { dateSchema } from "../../../utils/zod";
import { StrategicAlignment } from "../strategic-alignment.model";
import { alignmentSerializer } from "../strategic-alignment.serializer";

export const createStrategicAlignment = validate({
  body: z.object({
    description: z.string(),
    start_active: dateSchema(z.date()),
    end_active: dateSchema(z.date()),
  })
}, async ({ user, body }, res) => {
  const committee = await isCommitteeMember(user);
  if (!committee.isActive) {
    return res.status(403).json({ message: "just committee members can access" })
  }

  const alignment = await StrategicAlignment.create({
    description: body.description,
    startActive: body.start_active,
    endActive: body.end_active,
    insertedBy: user,
  })

  return res.status(201).json(await alignmentSerializer(alignment));
})

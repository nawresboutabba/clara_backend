import { z } from "zod";
import Barema, {
  BaremaAxis,
  BaremaType,
  BaremaValueKind,
} from "../barema.model";
import { validate } from "../../../utils/express/express-handler";
import { isCommitteeMember } from "../../../utils/acl/function.is_committe_member";
import { baremaSerializer } from "../barema.serializer";

export const createBarema = validate(
  {
    body: z.object({
      title: z.string(),
      description: z.string(),
      valueKind: BaremaValueKind,
      weight: z.number(),
      type: BaremaType,
      axis: BaremaAxis,
    }),
  },
  async ({ user, body }, res) => {
    const committee = await isCommitteeMember(user);

    if (!committee.isActive) {
      return res.status(403).json({ message: "not authorized" });
    }

    const createdBarema = await Barema.create({
      ...body,
      insertedBy: user,
    });

    return baremaSerializer(createdBarema);
  }
);

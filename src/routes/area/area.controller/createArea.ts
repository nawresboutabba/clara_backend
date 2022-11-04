import { z } from "zod";
import IntegrantService from "../../../services/Integrant.service";
import { validate } from "../../../utils/express/express-handler";
import { Area } from "../area.model";
import { genericAreaSerializer } from "../area.serializer";

export const createArea = validate(
  {
    body: z.object({ name: z.string() }),
  },
  async ({ body, user }, res) => {
    const currentLeader = await IntegrantService.currentLeader();
    if (user.userId !== currentLeader?.user?.userId) {
      return res.status(403).json({ message: "not authorized" });
    }
    const areas = await Area.create({ name: body.name, insertedBy: user });
    return genericAreaSerializer(areas);
  }
);

import { z } from "zod";
import IntegrantService from "../../../services/Integrant.service";
import { validate } from "../../../utils/express/express-handler";
import { Area } from "../area.model";
import { genericAreaSerializer } from "../area.serializer";

export const updateArea = validate(
  {
    params: z.object({ areaId: z.string() }),
    body: z.object({ name: z.string() }),
  },
  async ({ params: { areaId }, body, user }, res) => {
    const currentLeader = await IntegrantService.currentLeader();
    if (user.userId !== currentLeader?.user?.userId) {
      return res.status(403).json({ message: "not authorized" });
    }

    const updatedArea = await Area.findByIdAndUpdate(
      areaId,
      {
        name: body.name,
      },
      { new: true }
    );
    return genericAreaSerializer(updatedArea);
  }
);

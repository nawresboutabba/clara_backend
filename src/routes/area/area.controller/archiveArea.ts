import { z } from "zod";
import IntegrantService from "../../../services/Integrant.service";
import { validate } from "../../../utils/express/express-handler";
import { Area } from "../area.model";
import { genericAreaSerializer } from "../area.serializer";

export const archiveArea = validate(
  {
    params: z.object({ areaId: z.string() }),
  },
  async ({ params: { areaId }, user }, res) => {
    const currentLeader = await IntegrantService.currentLeader();
    if (user.userId !== currentLeader?.user?.userId) {
      return res.status(403).json({ message: "not authorized" });
    }

    const area = await Area.findById(areaId);

    const updatedArea = await Area.findByIdAndUpdate(
      areaId,
      {
        $set: {
          archivedAt: area.archivedAt ? null : new Date(),
          archivedBy: area.archivedAt ? null : user,
        },
      },
      { new: true }
    );
    return genericAreaSerializer(updatedArea);
  }
);

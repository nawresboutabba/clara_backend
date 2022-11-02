import { validate } from "../../../utils/express/express-handler";
import { Area } from "../area.model";

export const getAreas = validate({}, async () => {
  const areas = await Area.find();
  return areas;
});

import { validate } from "../../../utils/express/express-handler";
import { Area } from "../area.model";
import { genericArrayAreaFilter } from "../area.serializer";

export const getAreas = validate({}, async () => {
  const areas = await Area.find();
  return genericArrayAreaFilter(areas);
});

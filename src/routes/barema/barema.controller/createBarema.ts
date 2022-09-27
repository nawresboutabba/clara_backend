import { z } from "zod";
import Barema from "../../../models/baremo";
import { validate } from "../../../utils/express/express-handler";

export const createBarema = validate({
  body: z.object({
    description: z.string()
  })
}, async ({
  user,
  body,
  // query,
  //  params
}) => {
  const createdBarema = await Barema.create({
    user,
    description: body.description,
  })

  return createdBarema;
})

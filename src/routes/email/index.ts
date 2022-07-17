import * as express from "express";
import { EVENTS_TYPE } from "../../constants";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { sendEmail } from "../../repository/repository.mailing";
const router = express.Router();

router.post('/email', [

], async (req: RequestMiddleware, res: ResponseMiddleware, next: express.NextFunction) => {
  try {
    const email = await sendEmail (req.body.to, EVENTS_TYPE.EXTERNAL_OPINION_INVITATION, {to:'hector'})
    res
      .status(200)
      .json(email)
      .send();
  } catch (error) {
    next(error)
  }
})

const emailRouter = router
export default emailRouter
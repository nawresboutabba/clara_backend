import * as express from "express";
import { EVENTS_TYPE } from "../../constants";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { sendEmail } from "../../repository/repository.mailing";
const router = express.Router();

/**
 * Endpoint just for testing!!
 * @TODO delete in production this endpoint
 */
router.post('/email', [

], async (req: RequestMiddleware, res: ResponseMiddleware, next: express.NextFunction) => {
  try {

    const Destination =  {
      BccAddresses: [
      ], 
      CcAddresses: [
      ], 
      ToAddresses: [
        req.body.to, 
      ]
    }

    let message
    if (req.body.message){
      message = req.body.message
    }else{
      message = 'No message '
    }


    const email = await sendEmail (Destination, EVENTS_TYPE.GREETINGS_MAILING, {message:message})
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
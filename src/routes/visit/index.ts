import * as express from "express";
import { URLS } from "../../constants";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { NextFunction } from "express"
import VisitController from "../../controller/visit";
import authentication from "../../middlewares/authentication";

const router = express.Router();

router.get(URLS.VISIT.LATEST, [
  authentication,
],async (req: RequestMiddleware,res:ResponseMiddleware,next: NextFunction)=> {
  try{
    const visitController = new VisitController()
    const query = {
      init: req.query.init || 0,
      offset: req.query.offset || 10,
      order_by : "visitDate"
    }
    const response = await visitController.getLatest(query,req.user)

    res
      .json(response)
      .status(200)
      .send()
  }catch(error){
    next(error)
  }
})

const visitRouter = router
export default visitRouter;
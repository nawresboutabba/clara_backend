import { NextFunction} from "express"
import HubController from "../../controller/hub";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
const router = require("express").Router();

router.post('/hub',[
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
        const hubController = new HubController()
        const resp = await hubController.newHub(req.body)
        res
        .json(resp)
        .status(200)
        .send()
    }catch(error){
        next(error)
    }

})

const hubRouter = router
export default hubRouter
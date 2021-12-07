import { NextFunction } from "express";
import { RequestMiddleware , ResponseMiddleware} from "../../middlewares/middlewares.interface";
import AreaController from "../../controller/area/area";

const router = require("express").Router();

router.post('/area',[
], async (req:RequestMiddleware, res:ResponseMiddleware, next: NextFunction)=> {
   try{
        const areaController = new AreaController()
        /**
         * Ver si no es mejor pasar una entidad singleton como lide o gente del comite, etc
         */
        const resp = await areaController.newArea(req.body)
        res
        .json(resp)
        .status(200)
        .send()
   }catch(error){
       next(error)
   }

})
const areaRouter = router

export default areaRouter
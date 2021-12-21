import { NextFunction } from "express";
import GroupValidatorController from "../../controller/group-validator";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";

const router = require("express").Router();

router.post('/group-validator',[
    
],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
        const groupValidatorController = new GroupValidatorController()
        const committe = await groupValidatorController.newGroupValidator(req.body)
        res
        .json(committe)
        .send()
    }catch(error){
        next(error)
    }
})

const groupValidatorRouter = router

export default groupValidatorRouter
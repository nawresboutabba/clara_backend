import { NextFunction } from "express";
import ValidatorController from "../../controller/validator";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";

const router = require("express").Router();

router.post('/validator',[
    
],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
        const validatorController = new ValidatorController()
        const validator = await validatorController.newValidator(req.body.userId)
        res
        .json(validator)
        .send()
    }catch(error){
        next(error)
    }
})

const validatorRouter = router

export default validatorRouter
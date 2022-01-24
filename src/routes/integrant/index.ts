import { NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { ERRORS } from "../../constants";
import IntegrantController from "../../controller/integrant";
import authentication from "../../middlewares/authentication";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import IntegrantService from "../../services/Integrant.service";
import UserService from "../../services/User.service";
import { throwSanitizatorErrors } from "../../utils/sanitization/satitization.errors";

const router = require("express").Router();

router.get('/integrant/general',[
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
        const integrantController = new IntegrantController()
        const generalMember =  await integrantController.getGeneralMembers()
        res
        .json(generalMember)
        .status(200)
        .send()
    }catch(error){
        next(error)
    }
})

router.post('/integrant/general',[
    authentication,
    check('userId',"user does not exist").custom((value, {req}): Promise<void>=> {
        return new Promise(async (resolve, reject)=> {
            const user = await UserService.getUserActiveByUserId(value)

            if(!user){
                return reject()
            }
            return resolve()
        })
    })
],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
        const integrantController = new IntegrantController()
        const integrant = await integrantController.newIntegrant(req.body.userId)
        res
        .json(integrant)
        .send()
    }catch(error){
        next(error)
    }
})

router.post('/integrant/leader/:integrantId',[
    check('integrantId', "integrant does not exist").custom((value, {req}): Promise<void>=> {
        return new Promise(async (resolve, reject)=> {
            const check = await IntegrantService.checkIntegrantStatus(value)
            if(check.exist && check.isActive){
                return resolve()
            }
            return reject()
        })
    }),
],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
        await throwSanitizatorErrors(validationResult , req, ERRORS.ROUTING.SIGNUP_USER)

        const integrantController = new IntegrantController()
        const integrant = await integrantController.newLeader(req.params.integrantId)
        res
        .json(integrant)
        .send()
    }catch(error){
        next(error)
    }
})


router.delete('/integrant/general/:integrantId',[
],async (req: RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=> {
    try{
        const integrantController = new IntegrantController()
        const integrant = await integrantController.deleteLeader(req.params.integrantId)
        res
        .json(integrant)
        .send()
    }catch(error){
        next(error)
    }
})
const integrantRouter = router

export default integrantRouter
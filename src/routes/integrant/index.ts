import { NextFunction } from "express";
import IntegrantController from "../../controller/integrant";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";

const router = require("express").Router();

/* router.get('/integrant',[

],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
        const integrantController = new IntegrantController()
        const committe = await integrantController.getAllCommitte()
        res
        .json(committe)
        .status(200)
        .send()
    }catch(error){
        next(error)
    }
})
 */
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
    
],async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try{
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
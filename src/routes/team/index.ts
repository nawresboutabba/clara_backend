"use strict";
import * as express from "express";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { NextFunction} from "express"
import TeamController from "../../controller/team";
const router = express.Router();

/* router.post('/team',[
], async (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
    try {
        const teamController =  new TeamController()
        const team = await teamController.newTeam(req.body)
        res
        .json(team)
        .status(200)
        .send()
    }catch(error){
        next(error)
    }
}) */

const teamRouter = router
export default teamRouter;
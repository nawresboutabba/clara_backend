import { NextFunction } from "express";
import * as express from "express";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import InvitationController from "../../controller/invitation";
import authentication from "../../middlewares/authentication";

const router = express.Router();

/* router.post('/invitation',[
authentication
], (req:RequestMiddleware,res: ResponseMiddleware,next: NextFunction)=> {
    try{
        const invitationController = new InvitationController()

        const invitationBody: InvitationBody = req.body
        const invitation = invitationController.newInvitation(req.user, invitationBody)
        res
        .json(invitation)
        .status(200)
        .send()
    }catch(error){
        next(error)
    }
}) */

const invitationsRouter = router
export default invitationsRouter;
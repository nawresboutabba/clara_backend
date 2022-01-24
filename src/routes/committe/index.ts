import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { body } from "express-validator";
import CommitteController from "../../controller/committe";

const router = require("express").Router();

router.post('/committe/leader',[
    body('userId', 'userId can not be empty').notEmpty()
    // @TODO check that user exist
], (req:RequestMiddleware, res:ResponseMiddleware, next: NextFunction)=> {
    try {

        const committeController = new CommitteController ()
        const committe = committeController.newLeader(req.body.userId)
        res
        .json(committe)
        .status(200)
        .send()

    }catch(error){
        next(error)
    }
})

const committeRouter = router
export default committeRouter
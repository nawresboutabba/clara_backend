import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";


const router = require("express").Router();

router.post('/interaction',[
], (req:RequestMiddleware, res: ResponseMiddleware, next: NextFunction)=> {
/*     try{

    } */
})


const interactionRouter = router

export default interactionRouter
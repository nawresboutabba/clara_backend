import { NextFunction } from "express";
import CompanyController from "../../controller/company";
import { RequestMiddleware, ResponseMiddleware } from "../../middlewares/middlewares.interface";
import { CompanyI } from "../../models/organizacion.companies";
import { validationResult, body } from "express-validator";


const router = require("express").Router();

router.post ('/company',[
  body('CNPJ', 'CNPJ can not be empty').notEmpty(),
  body('name', 'name can not be empty').notEmpty()
],
             async (req: RequestMiddleware,res:ResponseMiddleware,next: NextFunction) => {
               try{
                 const errors = validationResult(req).array();
  
                 if (errors.length > 0) {
                   res.status(400);
                   throw new Error(JSON.stringify(errors));
                 }   

                 const companyController = new CompanyController()
                 let resp: CompanyI
                 resp = await companyController.newCompany(req.body)
                 res
                   .status(200)
                   .json(resp)
                   .send()
               }catch(error){
                 next(error)
               }
             })
const companyRouter = router

export default companyRouter
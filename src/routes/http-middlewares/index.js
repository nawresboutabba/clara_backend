'use strict';

const router = require('express').Router();
const Configuration = require('../../models/configurations')
const { validationResult, body, query } = require('express-validator');
const checkResourceExistFromParams = require('@middlewares/check-resources-exist')


router.get('/check-resources-exist/solution/:solutionId',[
    checkResourceExistFromParams('solutions')
],async (req,res,next) => {
    try{
        const errors = validationResult(req).array();

        if (errors.length > 0) {
            res.status(400)
            throw new Error(JSON.stringify(errors));
        }
        const solution = req.resources.solution
        console.log(solution)
        res
        .status(200)
        .json(solution)
        .send()
    } catch(e){
        next(e)
    }
})

module.exports = router
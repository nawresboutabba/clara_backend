'use strict';

const router = require('express').Router();
const Solution = require('@models/solutions')
const { nanoid } = require('nanoid')
const { SOLUTION, SOLUTION_STATUS, HTTP_RESPONSE } = require('@root/src/constants')
const _ = require('lodash');
const { validationResult, body, param, query, check, custom } = require('express-validator');
const checkResourceExistFromParams = require('@middlewares/check-resources-exist')
router.post('/solution',[
    body('description', 'description can not be empty').notEmpty(),
],async (req,res,next) => {
    try{
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res.status(400)
        throw new Error(JSON.stringify(errors));
    }
    const created = new Date()
    const {
        // It can be null if it does not have an associated problem
        id_challenge:idChallenge,
        description,
        file_name: fileName,
        images,
        is_private: isPrivate,
    } = req.body
    const solution = new Solution({
        // @TODO automatic Id
        solutionId: nanoid(),
        // calculated trough session
        authorEmail: 'hardcode@gmail.com',
        created: created,
        updated: created,
        canChooseScope: SOLUTION.CAN_CHOOSE_SCOPE,
        status: SOLUTION_STATUS.LAUNCHED,
        timeInPark: SOLUTION.TIME_IN_PARK,
        idChallenge,
        description,
        fileName,
        images,
        isPrivate,
    })

        const resp = await solution.save();
        res
            .status(200)
            // @TODO delete _id and _v fields
            .json(resp)
            .send()
            next();
    } catch (e) {
        next(e)
    }
})

router.get('/solution/:solutionId',[
    checkResourceExistFromParams('solutions')
], (req,res,next) => {
    try{
        const errors = validationResult(req).array();

        if (errors.length > 0) {
            res.status(400)
            throw new Error(JSON.stringify(errors));
        }
    console.log(req.resources.solution)
        res
            .status(200)
            .json(req.resources.solution)
            .send()
        next()
    }catch(e){
        next(e)
    }
})

router.patch('/solution/:solutionId',[
    checkResourceExistFromParams('solutions'),
    body('')
    .custom(async(value, {req})=> {
        // Convert keys to camelCase
        req.resources = { 
            solution : _.mapKeys(value, (v, k) => _.camelCase(k)) 
        }
        return Promise.resolve()
    })
], async (req,res,next) => {
    try {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res.status(400)
        throw new Error(JSON.stringify(errors));
    }
    const solution = req.resources.solution
    
    solution.updated = new Date()
 
        await Solution.updateOne({
            solutionId : req.params.solutionId
        }, solution )
    
        res
            .status(201)
            .send()
        next()        
    } catch(e) {
        next(e)
    }
})

router.delete('/solution/:solutionId',[
    checkResourceExistFromParams('solutions')
], async (req,res,next) => {
    try{
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res.status(400)
        throw new Error(JSON.stringify(errors));
    } 
        await Solution.updateOne({
            solutionId : req.params.solutionId
        }, {updated: new Date(), active: false} )
    console.log("deleted")
        res
            .status(201)
            .send()
        next()        
    } catch(e) {
        next(e)
    }
})

module.exports = router
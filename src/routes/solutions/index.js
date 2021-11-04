'use strict';

const router = require('express').Router();
const Solution = require('@models/solutions')
const { nanoid } = require('nanoid')
const { SOLUTION, SOLUTION_STATUS } = require('@root/src/constants')
const _ = require('lodash');
const { validationResult, body, param, query, check, custom } = require('express-validator');
const checkResourceExistFromParams = require('@utils/check-resources-exist')

router.post('/solution',[
    body('description', 'description can not be empty').notEmpty(),
],async (req,res,next) => {

    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res
            .status(400)
            .json({
                error: {
                    code: 400,
                    details: errors,
                    message: 'validation failed'
                }
            });
        return next();
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
    try{
        const resp = await solution.save();
        res
            .status(200)
            // @TODO delete _id and _v fields
            .json(resp)
            .send()
            next();
    } catch (e) {
        res
            .status(400)
            .json({
                error: 'error'
            })
    }
})

router.get('/solution/:solutionId',[
    param('solutionId')
    .custom(async (value, {req}) => {
        const element = await Solution.find( {idSolution : value})
        if (_.isEmpty(element) ){
            return Promise.reject('Solution does not exist')
        } else {
            req.resources = { solution :_.first(element) }
            return Promise.resolve()
        }
    })
], (req,res,next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        res
            .status(400)
            .json({
                error: {
                    code: 404,
                    details: errors,
                    message: 'validation failed'
                }
            });
        return next();
    }

    res
        .status(200)
        .json(req.resources.solution)
        .send()
    next()
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
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res
            .status(400)
            .json({
                error: {
                    code: 404,
                    details: errors,
                    message: 'validation failed'
                }
            });
        return next();
    }
    const solution = req.resources.solution
    
    solution.updated = new Date()
    try {
        await Solution.updateOne({
            solutionId : req.params.solutionId
        }, solution )
    
        res
            .status(201)
            .send()
        next()        
    } catch(e) {
        res
            .status(400)
            .json({
                error: `Error: ${e}`
            })
        next()
    }
})

router.delete('/solution/:solutionId',[
    checkResourceExistFromParams('solutions')
], async (req,res,next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res
            .status(400)
            .json({
                error: {
                    code: 404,
                    details: errors,
                    message: 'validation failed'
                }
            });
        return next();
    }
    const solution = req.resources.solution
    solution.updated = new Date()
    solution.active = false
    
    try {
        await Solution.updateOne({
            soluitionId : req.params.solutionId
        }, solution )
    
        res
            .status(201)
            .send()
        next()        
    } catch(e) {
        res
            .status(400)
            .json({
                error: `Error: ${e}`
            })
        next()
    }
})

module.exports = router
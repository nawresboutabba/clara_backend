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
], async (req,res,next) => {
    try {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        res.status(400)
        throw new Error(JSON.stringify(errors));
    }
    const solution = _.mapKeys(req.body, (v, k) => _.camelCase(k))
    console.log(_.mapKeys(req.body, (v, k) => _.camelCase(k)))
    solution.updated = new Date()
    const solutionId = req.params.solutionId
      await Solution.updateOne({
            solutionId : solutionId
        }, solution )

        const resp = await Solution.findOne({
            solutionId: solutionId, 
            active: true
          })

        res
            .status(200)
            //@TODO response from MongoDB
            .json(resp)
            .send()
        next()        
    } catch(e) {
        console.log("error!", e)
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
        res
            .status(201)
            .send()
        next()        
    } catch(e) {
        next(e)
    }
})

module.exports = router
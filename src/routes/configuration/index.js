'use strict';

const router = require('express').Router();
const Configuration = require('../../models/configurations')
const { validationResult, body, query } = require('express-validator');

router.post('/configuration',[
    body('version', 'version can not be empty').notEmpty(),
    body('description', 'description can not be empty').notEmpty(),
    body('can_choose_scope', 'description can not be empty').notEmpty(),
    query('can_choose_scope', `Invalid param status passed. Must be one of ${`"true" or "false"`}`)
    .if(query('status').notEmpty())
    .isIn([true, false]),
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
    
    const configuration = new Configuration({
        // @TODO automatic Id
        idConfiguration: req.body.solution,
        // It can be null if it does not have an associated problem
        // calculated trough session
        authorEmail: req.body.author_email,
        created: created,
        description: req.body.description,
        canChooseScope: req.body.can_choose_scope,
        isPrivate: req.body.is_private,
        // events cause state changes
        status: req.body.event,
        // Configuration defult
        //timeInPark: CONFIGURATION.TIMERS.PARK,
        timeInPark: 3000,
    })
    try{
        const resp = await configuration.save();
        console.info('inserted succesfully')
        res
            .status(201)
            .json(resp)
            .send()
            next();
    } catch (e) {
        console.log(e)
        res
            .status(400)
            .json({
                error: 'error'
            })
    }
})

module.exports = router
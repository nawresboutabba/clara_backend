'use strict';

const SOLUTION = {
    CAN_CHOOSE_SCOPE : true,
    TIME_IN_PARK: 3000
}

const SOLUTION_STATUS = {
    DRAFT: 'DRAFT',
    LAUNCHED: 'LAUNCHED'

}

const FAKE_GENERATOR = {
    userName : 'hasb',
    email:'sarquisboutroshector@gmail.com',
    role: 'GENERATOR'
}

const HTTP_RESPONSE = {
    _200: '200_OK',
    _400: '400_BAD_REQUEST',
    _404: '404_NOT_FOUND'
}

const RESOURCE = {
    CHALLENGE: "challenge",
    SOLUTION: "solution",
}
module.exports = {
    SOLUTION,
    SOLUTION_STATUS,
    FAKE_GENERATOR,
    HTTP_RESPONSE,
    RESOURCE
}
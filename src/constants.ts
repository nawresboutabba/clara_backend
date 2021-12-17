export const SOLUTION = {
    CAN_CHOOSE_SCOPE : true,
    TIME_IN_PARK: 3000
}

export const SOLUTION_STATUS = {
    DRAFT: 'DRAFT',
    LAUNCHED: 'LAUNCHED'

}

export const FAKE_GENERATOR = {
    userName : 'hasb',
    email:'sarquisboutroshector@gmail.com',
    role: 'GENERATOR'
}

export const HTTP_RESPONSE = {
    _200: 200,
    _400: 400,
    _404: 404,
    _409: 409,
    _500: 500
}

export const ERRORS = {
    ROUTING:{
        SIGNUP_USER: "EXTERNAL_400_SIGNUP_USER",
        ADD_SOLUTION: "EXTERNAL_400_ADD_SOLUTION",
        PATCH_SOLUTION: "EXTERNAL_400_PATCH_SOLUTION",
        CHECK_RESOURCE:"EXTERNAL_404_CHECK_RESOURCE"
    },
    REPOSITORY: {
        AUTH_FAILED: "EXTERNAL_500_AUTH_FAILED",
        CREATE_TOKEN: "INTERNAL_500_CREATE_TOKEN_ERROR",
        DELETE_USER: "INTERNAL_500_DELETE_USER",
        LEADER_NOT_ASSOCIATED_TO_USER: "INTERNAL_500_LEADER_NOT_ASSOCIATED_TO_USER",
        PASSWORD_GENERATION: "EXTERNAL_500_PASSWORD_GENERATION",
        USER_CREATION: "INTERNAL_500_USER_CREATION",
        USER_EXIST: "EXTERNAL_409_USER_EXIST",
    },
    SERVICE: {
        COMMITTE_EXIST:"INTERNAL_500_COMMITTE_EXIST",
        COMMITTE_NEW:"INTERNAL_500_COMMITTE_NEW",
        DELETE_USER: "INTERNAL_500_DELETE_USER",
        GET_CHALLENGE_ACTIVE_BY_ID: "INTERNAL_404_GET_ACTIVE_CHALLENGE_BY_ID",
        GET_COMMITTE: "INTERNAL_500_GET_COMMITTE",
        GET_USER_ACTIVE_BY_ID: "INTERNAL_500_GET_USER_ACTIVE_BY_ID",
        GET_USER_ACTIVE_BY_EMAIL:"INTERNAL_500_GET_USER_ACTIVE_BY_EMAIL",
        NEW_LEADER: "INTERNAL_500_NEW_LEADER",
        NEW_SOLUTION: "INTERNAL_500_NEW_SOLUTION",
        USER_ARRAY_PROMISE: "INTERNAL_500_USER_ARRAY_PROMISE",
        USER_EXIST: "INTERNAL_409_USER_EXIST",
        USER_NOT_EXIST: "INTERNAL_500_USER_NOT_EXIST",
        UPDATE_SOLUTION:"INTERNAL_500_UPDATE_SOLUTION"
    }
}

export const RESOURCE = {
    CHALLENGE: "challenge",
    SOLUTION: "solution",
}

export const LAYERS = {
    REPOSITORY: "REPOSITORY",
    ROUTING: "ROUTING",
    SERVICE: "SERVICE"
}

export const WSALevel = {
    COMPANY: "COMPANY",
    AREA:"AREA"
}
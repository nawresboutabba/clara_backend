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
        ADD_CHALLENGE: "EXTERNAL_400_ADD_CHALLENGE",
        ADD_SOLUTION: "EXTERNAL_400_ADD_SOLUTION",
        CHALLENGE_CONFIGURATION: "EXTERNAL_400_CHALLENGE_CONFIGURATION",
        CHECK_RESOURCE:"EXTERNAL_404_CHECK_RESOURCE",
        GET_AREA:"EXTERNAL_404_RESOURCE_DOES_NOT_EXIST",
        GROUP_VALIDATOR_POST:"EXTERNAL_409_GROUP_VALIDATOR_POST",
        INTEGRANTS_MUST_BE_AN_ARRAY: "EXTERNAL_400_INTEGRANTS_MUST_BE_AN_ARRAY",
        LISTING_SOLUTIONS:"EXTERNAL_400_LISTING_SOLUTION",
        NEW_AREA: "EXTERNAL_500_NEW_AREA",
        NEW_LEADER: "EXTERNAL_500_NEW_LEADER",
        ONE_OR_MORE_INTEGRANT_DOES_NOT_EXIST: "EXTERNAL_400_ONE_OR_MORE_INTEGRANT_DOES_NOT_EXIST",
        ONE_OR_MORE_INTEGRANT_IS_ALREADY_IN_GROUP_VALIDATOR: "EXTERNAL_409_ONE_OR_MORE_INTEGRANT_IS_ALREADY_IN_GROUP_VALIDATOR",
        OPERATION_NOT_AVAILABLE: "EXTERNAL_500_OPERATION_NOT_AVAILABLE",
        PATCH_SOLUTION: "EXTERNAL_400_PATCH_SOLUTION",
        SIGNUP_USER: "EXTERNAL_400_SIGNUP_USER",
        TEAM_AND_AUTHOR_NOT_EXIST: "EXTERNAL_500_TEAM_AND_AUTHOR_NOT_EXIST",
    },
    REPOSITORY: {
        ACTIVE_MEMBER: "EXTERNAL_500_ACTIVE_MEMBER",
        AUTH_FAILED: "EXTERNAL_500_AUTH_FAILED",
        CHALLENGE_FORBIDDEN: "EXTERNAL_500_CHALLENGE_FORBIDDEN",
        CHALLENGE_OR_AUTHOR_NOT_VALID: "EXTERNAL_500_CHALLENGE_OR_AUTHOR_NOT_VALID",
        CREATE_TOKEN: "INTERNAL_500_CREATE_TOKEN_ERROR",
        DELETE_USER: "INTERNAL_500_DELETE_USER",
        GET_COMMITTE_MEMBERS:"INTERNAL_500_GET_COMMITTE_MEMBERS",
        INTEGRANTS_IS_ALREADYT_IN_GROUP_VALIDATOR: "INTERNAL_500_INTEGRANTS_IS_ALREADYT_IN_GROUP_VALIDATOR",
        LEADER_NOT_ASSOCIATED_TO_USER: "INTERNAL_500_LEADER_NOT_ASSOCIATED_TO_USER",
        MEMBER_IS_INACTIVE_OR_NOT_EXIST: "EXTERNAL_500_MEMBER_IS_INACTIVE_OR_NOT_EXIST",
        MEMBER_IS_A_LEADER_OR_ROLE_NOT_EXIST:"INTERNAL_500MEMBER_IS_A_LEADER_OR_ROLE_NOT_EXIST",
        NEW_LEADER:"EXTERNAL_500_NEW_LEADER",
        PASSWORD_GENERATION: "EXTERNAL_500_PASSWORD_GENERATION",
        REACTION_INVALID: "EXTERNAL_500_REACTION_INVALID",
        TEAM_AND_AUTHOR_NOT_EXIST: "EXTERNAL_500_TEAM_AND_AUTHOR_NOT_EXIST",
        USER_CREATION: "INTERNAL_500_USER_CREATION",
        USER_EXIST: "EXTERNAL_409_USER_EXIST",
        USER_NOT_EXIST:"EXTERNAL_404_USER_NOT_EXIST"
    },
    SERVICE: {
        ABDICATION_LEADER: "INTERNAL_500_ABDICATION_LEADER",
        CHECK_USER_IN_COMMITTE: "INTERNAL_500_CHECK_USER_IN_COMMITTE",
        CHALLENGE_LISTING: "INTERNAL_500_CHALLENGE_LISTING",
        COMMITTE_EXIST:"INTERNAL_500_COMMITTE_EXIST",
        COMMITTE_NEW:"INTERNAL_500_COMMITTE_NEW",
        CONVERT_TO_LEADER:"INTERNAL_500_CONVERT_TO_LEADER",
        DELETE_USER: "INTERNAL_500_DELETE_USER",
        GET_ALL_AREAS: "INTERNAL_500_GET_ALL_AREAS",
        GET_ALL_GROUP_VALIDATORS:"INTERNAL_500_GET_ALL_GROUP_VALIDATORS",
        GET_ALL_VALIDATORS_BY_ID:"INTERNAL_500_GET_ALL_VALIDATORS_BY_ID",
        GET_AREA: "INTERNAL_500_GET_AREA",
        GET_CHALLENGE_ACTIVE_BY_ID: "INTERNAL_404_GET_ACTIVE_CHALLENGE_BY_ID",
        GET_CHALLENGE_CONFIGURATION: "INTERNAL_500_GET_CHALLENGE_CONFIGURATION",
        GET_COMMENTS:"INTERNAL_500_GET_COMMENTS",
        GET_COMMITTE_GENERAL: "INTERNAL_500_GET_COMMITTE_GENERAL",
        GET_COMMITTE_MEMBERS:"INTERNAL_500_GET_COMMITTE_MEMBERS",
        GET_COMMITTE: "INTERNAL_500_GET_COMMITTE",
        GET_CURRENT_LEADER:"INTERNAL_500_GET_CURRENT_LEADER",
        GET_GROUP_VALIDATOR:"INTERAL_500_GET_GROUP_VALIDATOR",
        GET_CHALLENGES_SOLUTIONS: "INTERNAL_500_GET_CHALLENGES_SOLUTIONS",
        GET_SOLUTION_CONFIGURATION:"INTERNAL_500_GET_SOLUTION_CONFIGURATION",
        GET_USER_ACTIVE_BY_ID: "INTERNAL_500_GET_USER_ACTIVE_BY_ID",
        GET_USER_ACTIVE_BY_EMAIL:"INTERNAL_500_GET_USER_ACTIVE_BY_EMAIL",
        GET_INTEGRANT_ACTIVE_BY_ID:"INTERNAL_500_GET_INTEGRANT_ACTIVE_BY_ID",
        INSERT_INTEGRANT_TO_GROUP_VALIDATOR:"INTERNAL_500_INSERT_INTEGRANT_TO_GROUP_VALIDATOR",
        NEW_AREA: "INTERNAL_500_NEW_AREA",
        NEW_COMMITTEE_MEMBER: "INTERNAL_500_NEW_COMMITTEE_MEMBER",
        NEW_GROUP_VALIDATOR:"INTERNAL_500_NEW_GROUP_VALIDATOR",
        NEW_LEADER: "INTERNAL_500_NEW_LEADER",
        NEW_SOLUTION: "INTERNAL_500_NEW_SOLUTION",
        NEW_VALIDATOR:"INTERNAL_500_NEW_VALIDATOR",
        POST_COMMENT_FAIL: "INTERNAL_500_POST_COMMENT_FAIL",
        POST_REACTION_FAIL: "INTERNAL_500_POST_REACTION_FAIL",
        UPDATE_CONFIGURATION:"INTERNAL_500_UPDATE_CONFIGURATION",
        USER_ARRAY_PROMISE: "INTERNAL_500_USER_ARRAY_PROMISE",
        USER_EXIST: "INTERNAL_409_USER_EXIST",
        USER_NOT_EXIST: "INTERNAL_500_USER_NOT_EXIST",
        UPDATE_SOLUTION:"INTERNAL_500_UPDATE_SOLUTION"
    }
}

export const RESOURCE = {
    CHALLENGE: "CHALLENGE",
    SOLUTION: "SOLUTION",
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

export const COMMITTE_ROLE = {
    LEADER: "LEADER",
    GENERAL: "GENERAL"
}

export const VALIDATIONS_MESSAGE_ERROR = {
    SOLUTION:{
        AUTHOR_EMPTY:"AUTHOR CAN NOT BE EMPTY",
        IS_PRIVATE_INVALID:"PRIVATE CONFIGURATION INVALID",
        DESCRIPTION_EMPTY: "DESCRIPTION CAN NOT BE EMPTY",
        TITLE_EMPTY: "TITLE CAN NOT BE EMPTY",
        WSALEVEL_INVALID:"WSALEVEL INVALID."
    },
    AREA : {
        NAME_EMPTY: "NAME CAN NOT BE EMPTY"
    }
}

export const WSALEVEL = {
    COMPANY:"COMPANY",
    AREA: "AREA"
}

export const REACTIONS = {
    LIKE: "LIKE",
    DONT_UNDERTAND: "DONT_UNDERSTAND"
}

export const RULES = {
    IS_GENERATOR: "IS_GENERATOR",
    IS_COMMITTE_MEMBER: "IS_COMMITTE_MEMBER",
    IS_LEADER:"IS_LEADER",
    IS_ADMIN:"IS_ADMIN",
    CAN_VIEW_CHALLENGE: "CAN_VIEW_CHALLENGE"
}

export const PARTICIPATION_MODE = {
    TEAM: "TEAM",
    INDIVIDUAL_WITH_COAUTHORSHIP: "INDIVIDUAL_WITH_COAUTHORSHIP"
}
export const INVITATIONS = {
    TEAM_PARTICIPATION : "TEAM_PARTICIPATION",
    COAUTHORSHIP_PARTICIPATION : "COAUTHORSHIP_PARTICIPATION"
}

export const OWNER = "owner@gmail.com"
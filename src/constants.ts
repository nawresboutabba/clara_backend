
export const URLS = {
  CHALLENGE : {
    CHALLENGE: '/challenge',
    CHALLENGE_PROPOSE: '/challenge/proposal',
    CHALLENGE_PROPOSE_PROPOSEID: '/challenge/proposal/:proposeId',
    CHALLENGE_CHALLENGEID: '/challenge/:challengeId',
    CHALLENGE_CHALLENGEID_COMMENT: '/challenge/:challengeId/comment',
    CHALLENGE_CHALLENGEID_SOLUTION: '/challenge/:challengeId/solution',
    CHALLENGE_CHALLENGEID_SOLUTION_SOLUTIONID: '/challenge/:challengeId/solution/:solutionId',
    CHALLENGE_PROPOSE_PROPOSEID_ACCEPT: '/challenge/proposal/:proposeId/accept',
  },
  GROUP_VALIDATOR : {
    GROUP_VALIDATOR_SOLUTION_SOLUTINOID_BAREMO: '/group-validator/solution/:solutionId/baremo'
  },
  SOLUTION :{
    SOLUTION_SOLUTIONID_BAREMO_GROUPVALIDATOR: '/solution/:solutionId/baremo/group-validator',
    SOLUTION_SOLUTIONID_BAREMO_GROUPVALIDATOR_CURRENT: '/solution/:solutionId/baremo/group-validator/current',
    SOLUTION_BAREMO_BAREMOID: '/solution/baremo/:baremoId',
    SOLUTION_BAREMO_BAREMOID_FINISH: '/solution/baremo/:baremoId/finish',
    SOLUTION_BAREMO_BAREMOID_REOPEN: '/solution/baremo/:baremoId/reopen',
    SOLUTION_SOLUTIONID_INVITATION: '/solution/:solutionId/invitation',
    SOLUTION_SOLUTIONID_INVITATION_INVITATIONID_RESPONSE: '/solution/:solutionId/invitation/:invitationId/response',
    COMMENT: '/solution/:solutionId/comment',
    SOLUTION_SOLUTIONID_COMMENT_COMMENTID: '/solution/comment/:commentId',
    SOLUTION: '/solution',
    SOLUTION_SOLUTIONID : '/solution/:solutionId'
  },
  VISIT:{
    LATEST: '/visit/latest',
  },
  TAG: {
    COMMENT: '/tag/comment',
    IDEA: '/tag/idea',
    CHALLENGE: '/tag/challenge'
  }
}

export const SOLUTION_STATUS = {
  DRAFT: 'DRAFT',
  PROPOSED: 'PROPOSED',
  APROVED_FOR_DISCUSSION: 'APROVED_FOR_DISCUSSION',
  READY_FOR_ANALYSIS: 'READY_FOR_ANALYSIS',
  ANALYZING: 'ANALYZING',
  REVIEW: 'REVIEW',
  APROVED_FOR_CONSTRUCTION: 'APROVED_FOR_CONSTRUCTION',
  REJECTED: 'REJECTED',
}

export const CHALLENGE_STATUS = {
  DRAFT: 'DRAFT',
  PROPOSED: 'PROPOSED',
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
}

export const BAREMO_STATUS = {
  ONGOING: 'ONGOING',
  CLOSED: 'CLOSED',
}

export const FAKE_GENERATOR = {
  userName : 'hasb',
  email:'sarquisboutroshector@gmail.com',
  role: 'GENERATOR'
}

export const TAG_ORIGIN = {
  IDEA: 'IDEA',
  CHALLENGE: 'CHALLENGE',
  COMMENT: 'COMMENT'
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
    ADD_COMMENT: "EXTERNAL_400_ADD_COMMENT",
    ADD_SOLUTION: "EXTERNAL_400_ADD_SOLUTION",
    ADD_TAG:"EXTERNAL_400_ADD_TAG",
    CHALLENGE_FORBIDDEN: "EXTERNAL_500_CHALLENGE_FORBIDDEN",
    CHALLENGE_DOES_NOT_EXIST: "EXTERNAL_500_CHALLENGE_DOES_NOT_EXIST",
    CHALLENGE_CONFIGURATION: "EXTERNAL_400_CHALLENGE_CONFIGURATION",
    CHANGE_PASSWORD: "EXTERNAL_400_CHANGE_PASSWORD",
    COMMENT_DOES_NOT_EXIST: "EXTERNAL_400_COMMENT_DOES_NOT_EXIST",
    COMMENT_FORBBIDEN: "EXTERNAL_400_COMMENT_FORBBIDEN",
    CHECK_RESOURCE:"EXTERNAL_404_CHECK_RESOURCE",
    CREATE_INVITATION: "EXTERNAL_404_CREATE_INVITATION",
    DEFAULT_CONFIGURATION_NOT_FOUND: "EXTERNAL_500_DEFAULT_CONFIGURATION_NOT_FOUND",
    GET_AREA:"EXTERNAL_404_RESOURCE_DOES_NOT_EXIST",
    GET_BAREMO:"EXTERNAL_404_GET_BARMEO",
    GET_COMMENTS:"EXTERNAL_404_GET_COMMENTS",
    GET_INVITATIONS:"EXTERNAL_404_GET_INVITATIONS",
    GET_MY_PARTICIPATION:"INTERNAL_500_GET_MY_PARTICIPATION",
    GROUP_VALIDATOR_POST:"EXTERNAL_409_GROUP_VALIDATOR_POST",
    GROUP_VALIDATOR_IDEAS_QUEUE:"EXTERNAL_409_GROUP_VALIDATOR_IDEAS_QUEUE",
    INTEGRANTS_MUST_BE_AN_ARRAY: "EXTERNAL_400_INTEGRANTS_MUST_BE_AN_ARRAY",
    LISTING_SOLUTIONS:"EXTERNAL_400_LISTING_SOLUTION",
    NEW_AREA: "EXTERNAL_500_NEW_AREA",
    NEW_BAREMO: "EXTERNAL_500_NEW_BAREMO",
    NEW_LEADER: "EXTERNAL_500_NEW_LEADER",
    ONE_OR_MORE_INTEGRANT_DOES_NOT_EXIST: "EXTERNAL_400_ONE_OR_MORE_INTEGRANT_DOES_NOT_EXIST",
    ONE_OR_MORE_INTEGRANT_IS_ALREADY_IN_GROUP_VALIDATOR: "EXTERNAL_409_ONE_OR_MORE_INTEGRANT_IS_ALREADY_IN_GROUP_VALIDATOR",
    OPERATION_NOT_AVAILABLE: "EXTERNAL_500_OPERATION_NOT_AVAILABLE",
    PARTICIPATION_MODE_NOT_AVAILABLE: "EXTERNAL_500_PARTICIPATION_MODE_NOT_AVAILABLE",
    PATCH_SOLUTION: "EXTERNAL_400_PATCH_SOLUTION",
    RESPONSE_INVITATION:"EXTERNAL_400_RESPONSE_INVITATION",
    SIGNUP_USER: "EXTERNAL_400_SIGNUP_USER",
    SOLUTION_FORBIDDEN:"EXTERNAL_400_SOLUTION_FORBIDDEN",
    SOLUTION_DOES_NOT_EXIST:"EXTERNAL_400_SOLUTION_DOES_NOT_EXIST",
    TEAM_AND_AUTHOR_NOT_EXIST: "EXTERNAL_500_TEAM_AND_AUTHOR_NOT_EXIST",
    WSALEVEL_NOT_AVAILABLE: "EXTERNAL_500_WSALEVEL_NOT_AVAILABLE"
  },
  REPOSITORY: {
    ACTIVE_MEMBER: "EXTERNAL_500_ACTIVE_MEMBER",
    AUTH_FAILED: "EXTERNAL_500_AUTH_FAILED",
    CHALLENGE_OR_AUTHOR_NOT_VALID: "EXTERNAL_500_CHALLENGE_OR_AUTHOR_NOT_VALID",
    CREATE_SOLUTION:"INTERNAL_500_CREATE_SOLUTION",
    CREATE_TOKEN: "INTERNAL_500_CREATE_TOKEN_ERROR",
    DELETE_USER: "INTERNAL_500_DELETE_USER",
    GET_COMMITTE_MEMBERS:"INTERNAL_500_GET_COMMITTE_MEMBERS",
    GET_BAREMO: "INTERNAL_500_GET_BAREMO",
    GET_URL_IMAGE_SIGNED:"INTERNAL_500_GET_URL_IMAGE_SIGNED",
    GET_URL_IMAGE_SIGNED_FOR_POST:"INTERNAL_500_GET_URL_IMAGE_SIGNED_FOR_POST",
    IDEA_ANALYSIS_LISTING:"INTERNAL_500_IDEA_ANALYSIS_LISTING",
    INTEGRANTS_IS_ALREADYT_IN_GROUP_VALIDATOR: "INTERNAL_500_INTEGRANTS_IS_ALREADYT_IN_GROUP_VALIDATOR",
    LEADER_NOT_ASSOCIATED_TO_USER: "INTERNAL_500_LEADER_NOT_ASSOCIATED_TO_USER",
    MEMBER_IS_INACTIVE_OR_NOT_EXIST: "EXTERNAL_500_MEMBER_IS_INACTIVE_OR_NOT_EXIST",
    MEMBER_IS_A_LEADER_OR_ROLE_NOT_EXIST:"INTERNAL_500MEMBER_IS_A_LEADER_OR_ROLE_NOT_EXIST",
    NEW_BAREMO: "EXTERNAL_500_NEW_BAREMO",
    NEW_LEADER:"EXTERNAL_500_NEW_LEADER",
    NEW_CHALLENGE: "EXTERNAL_500_NEW_CHALLENGE",
    PASSWORD_GENERATION: "EXTERNAL_500_PASSWORD_GENERATION",
    REACTION_INVALID: "EXTERNAL_500_REACTION_INVALID",
    TEAM_AND_AUTHOR_NOT_EXIST: "EXTERNAL_500_TEAM_AND_AUTHOR_NOT_EXIST",
    UPDATE_INVITATIONS: "EXTERNAL_500_UPDATE_INVITATIONS",
    USER_CREATION: "INTERNAL_500_USER_CREATION",
    USER_EXIST: "EXTERNAL_409_USER_EXIST",
    USER_NOT_EXIST:"EXTERNAL_404_USER_NOT_EXIST",
    VIEW_TRANSFORMATION: "INTERNAL_404_VIEW_TRANSFORMATION"
  },
  SERVICE: {
    ABDICATION_LEADER: "INTERNAL_500_ABDICATION_LEADER",
    BAREMO_GET_ALL_BY_SOLUTION: "INTERNAL_500_BAREMO_GET_ALL_BY_SOLUTION",
    CHECK_USER_IN_COMMITTE: "INTERNAL_500_CHECK_USER_IN_COMMITTE",
    CHALLENGE_LISTING: "INTERNAL_500_CHALLENGE_LISTING",
    COMMITTE_EXIST:"INTERNAL_500_COMMITTE_EXIST",
    COMMITTE_NEW:"INTERNAL_500_COMMITTE_NEW",
    CONVERT_TO_LEADER:"INTERNAL_500_CONVERT_TO_LEADER",
    CONFIRM_INVITATION:"INTERNAL_500_CONFIRM_INVITATION",
    DELETE_USER: "INTERNAL_500_DELETE_USER",
    GET_ALL_AREAS: "INTERNAL_500_GET_ALL_AREAS",
    GET_ALL_GROUP_VALIDATORS:"INTERNAL_500_GET_ALL_GROUP_VALIDATORS",
    GET_ALL_VALIDATORS_BY_ID:"INTERNAL_500_GET_ALL_VALIDATORS_BY_ID",
    GET_AREA: "INTERNAL_500_GET_AREA",
    GET_BAREMO: "INTERNAL_500_GET_BAREMO",
    GET_CHALLENGE_ACTIVE_BY_ID: "INTERNAL_404_GET_ACTIVE_CHALLENGE_BY_ID",
    GET_CHALLENGE_CONFIGURATION: "INTERNAL_500_GET_CHALLENGE_CONFIGURATION",
    GET_CHALLENGES_SOLUTIONS: "INTERNAL_500_GET_CHALLENGES_SOLUTIONS",
    GET_COMMENT: "INTERNAL_500_GET_COMMENT",
    GET_COMMENTS:"INTERNAL_500_GET_COMMENTS",
    GET_COMMITTE_GENERAL: "INTERNAL_500_GET_COMMITTE_GENERAL",
    GET_COMMITTE_MEMBERS:"INTERNAL_500_GET_COMMITTE_MEMBERS",
    GET_COMMITTE: "INTERNAL_500_GET_COMMITTE",
    GET_CURRENT_LEADER:"INTERNAL_500_GET_CURRENT_LEADER",
    GET_GENERIC_CHALLENGE: "INTERNAL_500_GET_GENERIC_CHALLENGE",
    GET_GROUP_VALIDATOR:"INTERAL_500_GET_GROUP_VALIDATOR",
    GET_PROPOSAL_CHALLENGE:"INTERNAL_500_GET_PROPOSAL_CHALLENGE",
    GET_TEAM_BY_NAME: "INTERNAL_500_GET_TEAM",
    GET_SOLUTION_CONFIGURATION:"INTERNAL_500_GET_SOLUTION_CONFIGURATION",
    GET_TAG: "INTERNAL_500_GET_TAG",
    GET_ARRAY_TAGS: "INTERNAL_500_GET_ARRAY_TAGS",
    GET_INVITATION: "INTERNAL_500_GET_INVITATION",
    GET_USER_ACTIVE_BY_ID: "INTERNAL_500_GET_USER_ACTIVE_BY_ID",
    GET_USER_ACTIVE_BY_EMAIL:"INTERNAL_500_GET_USER_ACTIVE_BY_EMAIL",
    GET_USER_TEAMS_PARTICIPATIONS:"INTERNAL_500_GET_USER_TEAMS_PARTICIPATIONS",
    GET_INTEGRANT_ACTIVE_BY_ID:"INTERNAL_500_GET_INTEGRANT_ACTIVE_BY_ID",
    GET_INTEGRANT_ACTIVE_BY_USER:"INTERNAL_500_GET_INTEGRANT_ACTIVE_BY_USER",
    GET_INTEGRANTS_OF_TEAM_VALIDATOR:"INTERNAL_500_GET_INTEGRANTS_OF_TEAM_VALIDATOR",
    INSERT_INTEGRANT_TO_GROUP_VALIDATOR:"INTERNAL_500_INSERT_INTEGRANT_TO_GROUP_VALIDATOR",
    LIST_PROPOSAL_CHALLENGE:"INTERNAL_500_LIST_PROPOSAL_CHALLENGE",
    NEW_AREA: "INTERNAL_500_NEW_AREA",
    NEW_BAREMO: "INTERNAL_500_BAREMO",
    NEW_CHALLENGE: "INTERNAL_500_NEW_CHALLENGE",
    NEW_COMMITTEE_MEMBER: "INTERNAL_500_NEW_COMMITTEE_MEMBER",
    NEW_GROUP_VALIDATOR:"INTERNAL_500_NEW_GROUP_VALIDATOR",
    NEW_INVITATION: "INTERNAL_500_NEW_INVITATION",
    NEW_LEADER: "INTERNAL_500_NEW_LEADER",
    NEW_PROPOSAL_CHALLENGE: "INTERNAL_500_NEW_PROPOSAL_CHALLENGE",
    NEW_SOLUTION: "INTERNAL_500_NEW_SOLUTION",
    NEW_TAG: "INTERNAL_500_NEW_TAG",
    NEW_VALIDATOR:"INTERNAL_500_NEW_VALIDATOR",
    POST_COMMENT_FAIL: "INTERNAL_500_POST_COMMENT_FAIL",
    POST_EVALUATION_NOTE: "INTERNAL_500_POST_EVALUATION_NOTE",
    POST_REACTION_FAIL: "INTERNAL_500_POST_REACTION_FAIL",
    SOLUTION_DOES_NOT_EXIST:"INTERNAL_500_SOLUTION_DOES_NOT_EXIST",
    SOLUTION_USER_PARTICIPATIONS:"INTERNAL_500_SOLUTION_USER_PARTICIPATIONS",
    UPDATE_BAREMO: "INTERNAL_500_UPDATE_BAREMO",
    UPDATE_CONFIGURATION:"INTERNAL_500_UPDATE_CONFIGURATION",
    USER_ARRAY_PROMISE: "INTERNAL_500_USER_ARRAY_PROMISE",
    USER_EXIST: "INTERNAL_409_USER_EXIST",
    USER_NOT_EXIST: "INTERNAL_500_USER_NOT_EXIST",
    UPDATE_SOLUTION:"INTERNAL_500_UPDATE_SOLUTION",
    UPDATE_PASSWORD: "INTERNAL_500_UPDATE_PASSWORD"
  },
  STATE_MACHINE: {
    ACTION_NOT_FOUND: "ACTION_NOT_FOUND"
  }
}

export const RESOURCE = {
  CHALLENGE: "CHALLENGE",
  SOLUTION: "SOLUTION",
}
export const CHALLENGE_TYPE = {
  GENERIC: "GENERIC",
  PARTICULAR: "PARTICULAR"
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

export const BAREMO_TYPE = {
  TEAM_VALIDATOR: "TEAM_VALIDATOR",
  SPECIALIST_INTERVENTION: "SPECIALIST_INTERVENTION"
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
export const VIEW_BY = {
  CHALLENGE : "CHALLENGE",
  SOLUTION : "SOLUTION"
}

export const WSALEVEL = {
  COMPANY:"COMPANY",
  AREA: "AREA"
}

export const COMMENT_LEVEL = {
  GROUP: "GROUP",
  PUBLIC:"PUBLIC"
}


export const RULES = {
  CAN_EDIT_SOLUTION: "CAN_EDIT_SOLUTION",
  CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL: "CAN_INSERT_CHALLENGE_OR_CHALLENGE_PROPOSAL",
  CAN_INSERT_TAG: 'CAN_INSERT_TAG',
  CAN_VIEW_CHALLENGE: "CAN_VIEW_CHALLENGE",
  CAN_VIEW_COMMENT: "CAN_VIEW_COMMENT",
  CAN_VIEW_SOLUTION: "CAN_VIEW_SOLUTION",
  IS_ADMIN:"IS_ADMIN",
  IS_BAREMO_CREATOR: "IS_BAREMO_CREATOR",
  IS_COMMITTE_MEMBER: "IS_COMMITTE_MEMBER",
  IS_GENERATOR: "IS_GENERATOR",
  IS_LEADER:"IS_LEADER",
  IS_PART_OF_GROUP_VALIDATOR:"IS_PART_OF_GROUP_VALIDATOR",
  IS_SOLUTION_CREATOR: "IS_SOLUTION_CREATOR",
  IS_THE_RECIPIENT_OF_THE_INVITATION:"IS_THE_RECIPIENT_OF_THE_INVITATION",
  IS_VALIDATOR_OF_SOLUTION: "IS_VALIDATOR_OF_SOLUTION"
}

export const PARTICIPATION_MODE = {
  TEAM: "TEAM",
  INDIVIDUAL_WITH_COAUTHORSHIP: "INDIVIDUAL_WITH_COAUTHORSHIP"
}
export const INVITATIONS = {
  TEAM_PARTICIPATION : "TEAM_PARTICIPATION",
  EXTERNAL_OPINION: "EXTERNAL_OPINION",
  COAUTHORSHIP_PARTICIPATION : "COAUTHORSHIP_PARTICIPATION"
}

export const EVALUATION_NOTE_ROLE = {
  GROUP_VALIDATOR: "GROUP_VALIDATOR",
  EXTERNAL_OPINION: "EXTERNAL_OPINION"
}

export const INTERACTION = {
  COMMENT: "COMMENT",
  REACTIONS :{
    LIKE: "LIKE",
    DONT_UNDERTAND: "DONT_UNDERSTAND"
  }
}

export const OWNER = "owner@gmail.com"

export const INVITATION = {
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED"
}
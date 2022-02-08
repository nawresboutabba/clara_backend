import * as express from 'express';
import { ConfigurationDefaultI } from '../models/configuration.default';
import { GroupValidatorI } from '../models/group-validator';
import { AreaI } from '../models/organization.area';
import { ChallengeI } from '../models/situation.challenges';
import { SolutionI } from '../models/situation.solutions';
import { UserI } from '../models/users';

export interface RequestMiddleware extends express.Request {
    user: UserI;
    resources?: {
      solution?: SolutionI 
      challenge?: ChallengeI
    },
    utils?: {
      departmentAffected?: Array<AreaI>
      groupValidator?: GroupValidatorI
      areasAvailable?: Array<AreaI>
      participation?:{
        creator: UserI
        guests: UserI[]
      }
      defaultSolutionConfiguration?: ConfigurationDefaultI
    }
}

export interface ResponseMiddleware extends express.Response {
}
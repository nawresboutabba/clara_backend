import * as express from 'express';
import { ChallengeI } from '../models/situation.challenges';
import { SolutionI } from '../models/situation.solutions';
import { UserI } from '../models/users';

export interface RequestMiddleware extends express.Request {
    user: UserI;
    resources?: {
      solution?: SolutionI 
      challenge?: ChallengeI
    }
}

export interface ResponseMiddleware extends express.Response {
}
import * as express from 'express';
import { TYPE_CHALLENGE } from '../models/challenges';
import { TYPE_SOLUTION } from '../models/solutions';
import { UserRequest } from '../controller/users';

export interface RequestMiddleware extends express.Request {
    user: UserRequest;
    resources?: {
      solution?: TYPE_SOLUTION 
      challenge?: TYPE_CHALLENGE
    }
}

export interface ResponseMiddleware extends express.Response {
}
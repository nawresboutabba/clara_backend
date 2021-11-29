import * as express from 'express';
import { TYPE_CHALLENGE } from '../models/challenges';
import { TYPE_SOLUTION } from '../models/solutions';

export interface RequestMiddleware extends express.Request {
    user: {
        email: string;
        userId: string;
        firstName: string;
        lastName:string;
      };
    resources?: {
      solution?: TYPE_SOLUTION 
      challenge?: TYPE_CHALLENGE
    }
}

export interface ResponseMiddleware extends express.Response {
}
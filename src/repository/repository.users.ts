import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserI } from '../models/users';
import { nanoid } from 'nanoid'
import UserService from '../services/User.service';
import { UserBody, Login, UserResponse, UserRequest } from '../controller/users'
import { ERRORS, HTTP_RESPONSE, VIEW_BY } from '../constants'
import RepositoryError from '../handle-error/error.repository';
import { genericUserFilter } from '../utils/field-filters/user';
import SolutionService from '../services/Solution.service';
import { genericArraySolutionsFilter } from '../utils/field-filters/solution';
import TeamService from '../services/Team.service';
import { isCommitteMember } from '../utils/acl/function.is_committe_member';

export const signUp  = async (body: UserBody):Promise<UserResponse> => {
  return new Promise (async (resolve, reject)=> {
    await UserService
      .getUserActiveByEmail(body.email)
      .then(async user => {
        if (user) {
          return  reject (new RepositoryError(ERRORS.REPOSITORY.USER_EXIST, HTTP_RESPONSE._409));
        }
        await hash(body.password, 10, async (err: Error, hash: string) => {
          if (err) {
            return reject(new RepositoryError(
              ERRORS.REPOSITORY.PASSWORD_GENERATION, 
              HTTP_RESPONSE._500,
              err));
          }
          await UserService.newGenericUser({
            userId: nanoid(),
            username: body.username,
            email: body.email,
            password: hash,
            firstName: body.first_name,
            lastName: body.last_name,
            active: true,
            externalUser: false,
            points: 0,
          })
            .then(async user => {
              const resp = await genericUserFilter(user)
              return resolve(resp)
            })
            .catch(error => {
              return reject(error)
            });
        })
      })
      .catch(error => {
        const customError = new RepositoryError(
          ERRORS.REPOSITORY.USER_CREATION, 
          HTTP_RESPONSE._500, 
          error)
        return reject(customError)
      });
  })
}

export const login = async (body: Login ) : Promise<string> => {
  return new Promise (async (resolve, reject )=> {
    UserService
      .getUserActiveByEmail(body.email)
      .then(async (user: UserI) => {
        if (user == null) {
          /**
           * User does not exist
           */
          return reject (new RepositoryError (ERRORS.REPOSITORY.AUTH_FAILED, HTTP_RESPONSE._500))
        }  
        await compare(body.password, user.password, async (err: Error, result: boolean) => {
          try {
            if (err || result == false) {
              /**
             * Comparation error
             */
              return reject(new RepositoryError(ERRORS.REPOSITORY.AUTH_FAILED, HTTP_RESPONSE._500,err))
            }
            const token = sign(
              {
                user
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );  
            return resolve(token)
          }catch(error){
            /**
             * Generic error for this case: Creation token failed
             */
            const errorCustom = new RepositoryError(
              ERRORS.REPOSITORY.CREATE_TOKEN, 
              HTTP_RESPONSE._500,
              error)
            return reject(errorCustom)
          }
        })       
      })
      .catch(error => {
        return reject(error)
      });
  })
}

export const deleteUser = async (userId : string): Promise <boolean> => {
  return new Promise (async (resolve, reject)=> {
    await UserService
      .deleteUserWithLog(userId)
      .then(resp => {

        return resolve(resp)
      })
      .catch(error => {
        /**
         * Send to routing layer the error got in service layer
         */
        return reject(error)
      })
  })
}

export const getUserInformation = async (userInformation: UserRequest): Promise<UserResponse> => {
  try{
    const user: UserI = await UserService.getUserActiveByUserId(userInformation.userId);
    const status = await isCommitteMember(user)
    const resp:any = await genericUserFilter(user)

    resp.is_committe_member = status.isActive

    return resp
  }catch(error){
    return Promise.reject(error)
  }
}

export const getParticipation = async (user: UserI, query: any): Promise<any> => {
  try{
    const view = query.view_by
    const solutions = await SolutionService.getParticipations(user)
    const rest = await genericArraySolutionsFilter(solutions)
    if (view === VIEW_BY.SOLUTION){
      return rest
    }else if(view === VIEW_BY.CHALLENGE){
      try {
      /**
       * Get challenge_id. and save as set operation
       */
        const challenges = new Set(rest.map(idea => idea.challenge.challenge_id ).filter(id => id != undefined))
        /**
        * Init dictionary with solution by challenge
        */
        const solutionByChallenge = {}
        /**
        * Set information about challenge. 
        */
        challenges.forEach(challengeId => {
          rest.forEach(idea => {
            if(idea.challenge?.challenge_id == challengeId){
              solutionByChallenge[challengeId]={
                challenge: idea.challenge,
                /**
                * Init array of solutions
                */
                solutions: []
              }
            }
          })
        })
       
        /**
        * Foreach solution, add the corresponding challenge
        */
        rest.forEach(solution => {
          if (challenges.has(solution.challenge?.challenge_id )){
            const challenge_id =  solution.challenge.challenge_id
            delete solution.challenge
            solutionByChallenge[challenge_id].solutions.push(solution)
          }
        })
        return solutionByChallenge
      }catch(error){
        return Promise.reject(
          new RepositoryError(
            ERRORS.REPOSITORY.VIEW_TRANSFORMATION,
            HTTP_RESPONSE._500,
            error
          )
        )
      }
    } else {
      throw "Invalid view_by"
    }
  }catch(error){ 
    return Promise.reject(error)
  }
}
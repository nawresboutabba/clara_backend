import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserI } from '../models/users';
import { nanoid } from 'nanoid'
import UserService from '../services/User.service';
import { UserBody, Login } from '../controller/users'
import { ERRORS, HTTP_RESPONSE } from '../constants'
import RepositoryError from '../handle-error/error.repository';
import { response } from 'express';

export const signUp  = async (body: UserBody):Promise<UserI> => {
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
                email: body.email,
                password: hash,
                firstName: body.first_name,
                lastName: body.last_name,
                active: true,
                externalUser: false
              })
              .then(user => {
                return resolve(user)
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
      .then(async user=> {
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
  
            let userInformation: {
              email: string,
              userId: string,
              firstName:string,
              lastName:string,
            }
            userInformation = user
            const token = sign(
              {
                userInformation : userInformation
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

/*
export const addUserInCompany = async (userId: string, companyId: string): Promise<UserI> => {
  return new Promise (async (resolve, reject)=> {
    try{
      const company = await CompanyService.getActiveCompanyById(companyId)
      console.log(company)
      if (company){
        const resp = await UserService.addUserInCompany(userId, company)
        return resolve(resp)
      }
      throw new Error("COMPANY_NULL OR UNDEFINED")
    }catch(error){
      return reject(error)
    }
  })
}

export const deleteCompanyInUser = async (userId:string, companyId: string): Promise<UserI> => {
    return new Promise(async (resolve, reject)=> {
      try{
        const company = await CompanyService.getActiveCompanyById(companyId)
        const resp = await UserService.deleteUserInCompany(userId, company)
        return resolve(resp)
      }catch(error){
        return reject(error)
      }
    })
}

export const checkUserInCompany = async (userId: string, companyId: string): Promise<boolean> => {
    return new Promise(async (resolve, reject)=> {
      try{
        const company = await CompanyService.getActiveCompanyById(companyId)
        const resp = UserService.checkUserInCompany(userId, company)
        return resolve(resp)
      }catch(error){
        return reject(error)
      }
    })
}
*/
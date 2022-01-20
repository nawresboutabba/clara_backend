import User, { UserI } from "../models/users";
import { startSession } from 'mongoose';
import HistoricalUser from "../models/historical-users";
import * as _ from 'lodash'; 
import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";

const UserService = {
    async getUserActiveByEmail (email: string): Promise <UserI> {
        return new Promise(async (resolve, reject) => {
          /**
           * @see https://mongoosejs.com/docs/tutorials/lean.html
           */
            User.findOne({
              email: email,
              active: true,              
            })
            .populate('areaVisible')
            .then(result => {
              return resolve(result)
            })
            .catch(error => {
              const customError = new ServiceError(
                ERRORS.SERVICE.GET_USER_ACTIVE_BY_EMAIL,
                HTTP_RESPONSE._500, 
                error)
              return reject(customError)
            })
        })
      },
    async getUserActiveByUserId (userId:string ): Promise<UserI> {
      return new Promise(async (resolve, reject)=> {

        await User
        .findOne({
          userId: userId,
          active: true,
        })
        .populate('areaVisible')
        .then(user => {
          return resolve(user)
        })
        .catch(error => {
          const customError = new ServiceError(
            ERRORS.SERVICE.GET_USER_ACTIVE_BY_EMAIL,
            HTTP_RESPONSE._500, 
            error)
          return reject(customError)
        })
      })
    },
    async newGenericUser (user: UserI ): Promise<UserI> {
        return new Promise((resolve, reject) => {
          User.create({
            userId: user.userId,
            email: user.email,
            active: true,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName
          })
            .then((resp) => {
              return resolve(resp);
            })
            .catch((err) => {
              const customError = new ServiceError(
                ERRORS.SERVICE.USER_EXIST, 
                HTTP_RESPONSE._409,
                err)
              return reject(customError);
            });
        });
      },

    async deleteUserWithLog (userId: string): Promise<boolean> {
        return new Promise (async (resolve, reject)=> {
            await this
            .getUserActiveByUserId(userId)
            .then(async user=> {
                if (user == null){
                    return reject(new ServiceError(ERRORS.SERVICE.USER_NOT_EXIST, HTTP_RESPONSE._500))
                }
                const oldData = _.omit(user.toJSON(), ["_id", "__v"]);
                const data = { update: new Date(), active: false };
                Object.assign(user, data);
                const session = await startSession();
                try {
                  session.startTransaction();
                  await Promise.all([
                    HistoricalUser.create([oldData], { session: session }),
                    user.save({ session: session }),
                  ]);
                  await session.commitTransaction();
                  session.endSession();
                  return resolve( true );
                } catch (error) {
                  await session.abortTransaction();
                  session.endSession();
                  const customError = new ServiceError(
                    ERRORS.SERVICE.UPDATE_SOLUTION, 
                    HTTP_RESPONSE._500,
                    error)
                  return reject(customError);
                }
          })
          .catch((error:any) => {
            return reject(error)
      })
    })
  },
  async  getUsersById (usersId: Array<string>):Promise<Array<UserI>>{
    return new Promise(async (resolve, reject)=>{
      try{
        let users: Array<Promise<UserI>>= [] 
        usersId.forEach(user => {
          users.push(this.getUserActiveByUserId(user))
      })
          await Promise
          .all(users)
          .then(result => {
              return resolve (result)
          })
          .catch(error => {
              const customError = new ServiceError(
                ERRORS.SERVICE.USER_EXIST,
                HTTP_RESPONSE._500,
                error
              )
              return reject(customError)
          })      
      }catch(error){
        const customError = new ServiceError(
          ERRORS.SERVICE.USER_EXIST,
          HTTP_RESPONSE._500,
          error
        )
        return reject(customError)
      }
    })
  }
}

export default UserService;
import User, { UserI } from "../models/users";
import { startSession } from 'mongoose';
import HistoricalUser from "../models/historical-users";
import * as _ from 'lodash'; 
import { CompanyI } from "../models/organizacion.companies";
const UserService = {
    async getUserActiveByEmail (email: string): Promise <UserI> {
        return new Promise((resolve, reject) => {
          User.findOne({
            email: email,
            active: true,
          })
            .lean()
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
    async getUserActiveByUserId (userId:string ): Promise<UserI> {
        const user = await User.findOne({
            userId: userId,
            active: true,
          })
          return user
      },
    async newGenericUser (user: UserI ): Promise<UserI> {
        return new Promise((resolve, reject) => {
          User.create({
            userId: user.userId,
            email: user.email,
            active: true,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            workSpace: user.workSpace,
          })
            .then((resp) => {
              return resolve(resp);
            })
            .catch((err) => {
              return reject(err);
            });
        });
      },

    async deleteUserWithLog (userId: string): Promise<boolean> {
        
        return new Promise (async (resolve, reject)=> {
            const user = await this.getUserActiveByUserId(userId)
            if (user == null){
                return reject(new Error("User does not exist"))
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
              return reject(error);
            }
      })
    },
    async addUserInCompany (userId: string, company: CompanyI):Promise<UserI>{
      return new Promise (async (resolve, reject)=> {
        try{
          /**
           * @see https://docs.mongodb.com/manual/reference/operator/update/addToSet/
           */
          const resp = await User
          .findOneAndUpdate({userId:userId},{$addToSet:{company:company}},{new: true})
          return resolve(resp)
        }catch (error){
          return reject(error)
        }
      })
    },
    async deleteUserInCompany(userId: string, company: CompanyI): Promise<UserI>{
      return new Promise (async (resolve, reject)=> {
        try{
          const companyId = company._id
          const resp = await User

          .findOneAndUpdate({userId:userId}, {$pull: {company:companyId}},{new: true})
          return resolve(resp)
        }catch(error){
          return reject(error)
        }
      })
    },
    async checkUserInCompany(userId: string, company: CompanyI):Promise<boolean>{
      return new Promise(async (resolve, reject)=> {
        try{
          /**
           * @see https://docs.mongodb.com/manual/reference/operator/query/all/
           */
          const resp = await User.findOne({$and:[{userId:userId}, {active:true}, {company:{$all:company}}]})
          if(resp){
            return resolve(true)
          }
          return resolve(false)
        }catch(error){
          return reject(error)
        }
      })
    }
}

export default UserService;
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { TYPE_USER } from '../models/users';
import { nanoid } from 'nanoid'
import UserService from '../services/User.service';
import { UserBody, Login } from '../controller/users'
import { ERRORS } from '../handle-error/const'

export const signUp  = async (body: UserBody):Promise<TYPE_USER> => {
  return new Promise (async (resolve, reject)=> {
    let user: TYPE_USER;
    user = await UserService.getUserActiveByEmail(body.email);
    if (user) {
      return  reject (ERRORS.USER_EXIST_409);
    }
      await hash(body.password, 10, async (err: Error, hash: string) => {
            if (err) {
              return reject(err);
            }
            const resp = await UserService.newGenericUser({
              userId: nanoid(),
              email: body.email,
              password: hash,
              firstName: body.first_name,
              lastName: body.last_name,
              workSpace: ["ABSOLUTE"],
              active: true,
            });
            user = resp
            return resolve(user)
          })
  })
}

export const login = async (body: Login ) : Promise<string> => {
  return new Promise (async (resolve, reject )=> {
    const user = await UserService.getUserActiveByEmail(body.email);
    if (user == null) {
      return reject (ERRORS.AUTH_FAILED_500)
    }  
    compare(body.password, user.password, async (err: Error, result: boolean) => {
        if (err || result == false) {
          return reject (ERRORS.AUTH_FAILED_500)
        }
        const token = sign(
          {
            email: user.email,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );  
        return resolve(token)
    })
  })
}

export const deleteUser = async (userId : string): Promise <boolean> => {
    return new Promise (async (resolve, reject)=> {
      try {
        await UserService.deleteUserWithLog(userId);
        return resolve (true)
      } catch (error){
        return reject(ERRORS.DELETE_USER_500)
      }
      
    })
}
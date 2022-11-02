import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UserI } from "../models/users";
import { nanoid } from "nanoid";
import UserService from "../services/User.service";
import {
  UserBody,
  Login,
  UserResponse,
  UserRequest,
  UserUpdate,
} from "../controller/users";
import { ERRORS, EVENTS_TYPE, HTTP_RESPONSE, VIEW_BY } from "../constants";
import RepositoryError from "../handle-error/error.repository";
import { genericUserFilter } from "../utils/field-filters/user";
import SolutionService from "../services/Solution.service";
import { genericArraySolutionsFilter } from "../routes/solutions/solution.serializer";
import { isCommitteeMember } from "../utils/acl/function.is_committe_member";
import * as _ from "lodash";
import InvitationService from "../services/Invitation.service";
import { genericArraySolutionInvitationFilter } from "../utils/field-filters/invitation";
import { sendEmail } from "./repository.mailing";

export const newExternalUser = async (
  email: string,
  password: string
): Promise<UserResponse> => {
  try {
    const username = email.split("@")[0];
    const hashPassword = await hash(password, 10);
    const userNew = await UserService.newGenericUser({
      userId: nanoid(),
      username: username,
      email: email,
      userImage: undefined,
      password: hashPassword,
      firstName: undefined,
      lastName: undefined,
      confirmed: false,
      active: false,
      externalUser: true,
      points: 0,
    });
    const info = {
      email,
      password,
    };
    const Destination = {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [email],
    };
    await sendEmail(Destination, EVENTS_TYPE.NEW_EXTERNAL_USER, info);
    const resp = await genericUserFilter(userNew);
    return resp;
  } catch (error) {
    const customError = new RepositoryError(
      ERRORS.REPOSITORY.USER_CREATION,
      HTTP_RESPONSE._500,
      error
    );
    return Promise.reject(customError);
  }
};

export const signUp = async (body: UserBody): Promise<UserResponse> => {
  const user = await UserService.getUserActiveByEmail(body.email);

  if (user) {
    throw new RepositoryError(ERRORS.REPOSITORY.USER_EXIST, HTTP_RESPONSE._409);
  }

  const hashPassword = await hash(body.password, 10).catch((err) => {
    throw new RepositoryError(
      ERRORS.REPOSITORY.PASSWORD_GENERATION,
      HTTP_RESPONSE._500,
      err
    );
  });

  await UserService.newGenericUser({
    userId: nanoid(),
    username: body.username,
    email: body.email,
    userImage: body.user_image,
    password: hashPassword,
    firstName: body.first_name,
    lastName: body.last_name,
    active: true,
    confirmed: true,
    externalUser: false,
    points: 0,
  }).catch((error) => {
    throw new RepositoryError(
      ERRORS.REPOSITORY.USER_CREATION,
      HTTP_RESPONSE._500,
      error
    );
  });

  const resp = await genericUserFilter(user);
  return resp;
};

export async function updateUser(userId: string, userData: UserUpdate) {
  const updatedUser = await UserService.updateUser(userId, userData);
  return genericUserFilter(updatedUser);
}

export const login = async (body: Login): Promise<string> => {
  try {
    let user = await UserService.getUserActiveByEmail(body.email);
    if (!user) {
      /**
       * Check for user external with invitation. active: false and confirmed: false
       */
      const query = {
        email: body.email,
        active: false,
        confirmed: false,
      };
      user = await UserService.getUser(query);
      if (!user) {
        /**
         * User does not exist
         */
        return Promise.reject(
          new RepositoryError(ERRORS.REPOSITORY.AUTH_FAILED, HTTP_RESPONSE._500)
        );
      }
      /**
       * First session. Change active and confirmed condition
       */
      const update = {
        active: true,
        confirmed: true,
      };
      user = await UserService.updateUser(user.userId, update);
    }
    const comparation = await compare(body.password, user.password);
    if (comparation) {
      const token = sign(
        {
          user,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "154h",
        }
      );
      return Promise.resolve(token);
    } else {
      return Promise.reject(
        new RepositoryError(ERRORS.REPOSITORY.AUTH_FAILED, HTTP_RESPONSE._500)
      );
    }
  } catch (error) {
    /**
     * Generic error for this case: Creation token failed
     */
    const errorCustom = new RepositoryError(
      ERRORS.REPOSITORY.CREATE_TOKEN,
      HTTP_RESPONSE._500,
      error
    );
    return Promise.reject(errorCustom);
  }
};

// export const deleteUser = async (userId : string): Promise <boolean> => {
//   return UserService.deleteUserWithLog(userId)
// }

export const getUserInformation = async (
  userInformation: UserRequest
): Promise<UserResponse> => {
  try {
    const user: UserI = await UserService.getUserActiveByUserId(
      userInformation.userId
    );
    const status = await isCommitteeMember(user);
    const resp: any = await genericUserFilter(user);

    resp.is_committe_member = status.isActive;

    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

const handlerUsers = {
  get(target, prop) {
    if (prop === "email") {
      const value = target.email;
      if (value) {
        const emailQuery = {
          $regex: `(?i).*${value}.*`,
        };
        return emailQuery;
      } else {
        return undefined;
      }
    } else if (prop == "user_id") {
      const value = target.user_id;
      if (value) {
        return value;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  },
};

export const getUsers = async (query: any): Promise<any> => {
  try {
    const queryCleaned = new Proxy(query, handlerUsers);
    const mongooseQuery = {
      ..._.pickBy(
        {
          email: queryCleaned.email,
          userId: queryCleaned.user_id,
        },
        _.identity
      ),
    };
    const users = await UserService.getUsers(mongooseQuery);
    return users;
  } catch (error) {
    return Promise.reject(
      new RepositoryError(
        ERRORS.REPOSITORY.GET_USERS,
        HTTP_RESPONSE._500,
        error
      )
    );
  }
};

const handlerInvitations = {
  get(target, prop) {
    if (prop === "status") {
      const value = target.status;
      if (!value) {
        return undefined;
      } else if (_.isString(value) == 1) {
        const status = [value];
        return status;
      } else if (value.length > 1) {
        return value;
      } else {
        return undefined;
      }
    }
  },
};

export const getParticipation = async (
  user: UserI,
  query: any
): Promise<any> => {
  try {
    const view = query.view_by;
    const solutions = await SolutionService.getParticipations(user);
    const rest = await genericArraySolutionsFilter(solutions);
    if (view === VIEW_BY.SOLUTION) {
      return rest;
    } else if (view === VIEW_BY.CHALLENGE) {
      try {
        /**
         * Get challenge_id. and save as set operation
         */
        const challenges = new Set(
          rest.map((idea) => idea.challenge.id).filter((id) => id != undefined)
        );
        /**
         * Init dictionary with solution by challenge
         */
        const solutionByChallenge = {};
        /**
         * Set information about challenge.
         */
        challenges.forEach((challengeId) => {
          rest.forEach((idea) => {
            if (idea.challenge?.id == challengeId) {
              solutionByChallenge[challengeId] = {
                challenge: idea.challenge,
                /**
                 * Init array of solutions
                 */
                solutions: [],
              };
            }
          });
        });

        /**
         * Foreach solution, add the corresponding challenge
         */
        rest.forEach((solution) => {
          if (challenges.has(solution.challenge?.id)) {
            const challenge_id = solution.challenge.id;
            delete solution.challenge;
            solutionByChallenge[challenge_id].solutions.push(solution);
          }
        });
        return solutionByChallenge;
      } catch (error) {
        return Promise.reject(
          new RepositoryError(
            ERRORS.REPOSITORY.VIEW_TRANSFORMATION,
            HTTP_RESPONSE._500,
            error
          )
        );
      }
    } else {
      throw "Invalid view_by";
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const changePassword = async (
  newPassword: string,
  oldPassword: string,
  user: UserI
): Promise<UserResponse> => {
  try {
    if (!(await compare(oldPassword, user.password))) {
      throw new RepositoryError(
        ERRORS.REPOSITORY.PASSWORD_GENERATION,
        HTTP_RESPONSE._400
      );
    }
    const hashPassword = await hash(newPassword, 10).catch((err) => {
      throw new RepositoryError(
        ERRORS.REPOSITORY.PASSWORD_GENERATION,
        HTTP_RESPONSE._500,
        err
      );
    });

    const userResp = await UserService.updateUser(user.userId, {
      password: hashPassword,
    });

    return genericUserFilter(userResp);
  } catch (error) {
    return Promise.reject(
      new RepositoryError(
        ERRORS.REPOSITORY.PASSWORD_GENERATION,
        HTTP_RESPONSE._500,
        error
      )
    );
  }
};

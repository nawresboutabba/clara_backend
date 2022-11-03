import User, { UserI } from "../routes/users/user.model";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import { removeEmpty } from "../utils/general/remove-empty";

const UserService = {
  /**
   * General query for user. As example users not confirmed
   * @param query
   */
  async getUser(query: any): Promise<UserI> {
    try {
      const user = await User.findOne(query);
      return user;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_USER_ACTIVE_BY_EMAIL,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getUserActiveByEmail(email: string): Promise<UserI> {
    /**
     * @see https://mongoosejs.com/docs/tutorials/lean.html
     */
    const user = await User.findOne({ email, active: true })
      .populate("areaVisible")
      .catch((error) => {
        throw new ServiceError(
          ERRORS.SERVICE.GET_USER_ACTIVE_BY_EMAIL,
          HTTP_RESPONSE._500,
          error
        );
      });
    return user;
  },
  async getUserActiveByUserId(userId: string): Promise<UserI> {
    const user = await User.findOne({ userId, active: true })
      .populate("areaVisible")
      .catch((error) => {
        throw new ServiceError(
          ERRORS.SERVICE.GET_USER_ACTIVE_BY_EMAIL,
          HTTP_RESPONSE._500,
          error
        );
      });
    return user;
  },
  async newGenericUser(params: UserI): Promise<UserI> {
    try {
      const user = await User.create(params);
      return user;
    } catch (err) {
      throw new ServiceError(
        ERRORS.SERVICE.USER_EXIST,
        HTTP_RESPONSE._409,
        err
      );
    }
  },
  async getUsers(query: any): Promise<any> {
    try {
      const resp = await User.find({
        ...query,
      });
      return resp;
    } catch (error) {
      const customError = new ServiceError(
        ERRORS.SERVICE.GET_USERS,
        HTTP_RESPONSE._500,
        error
      );
      return Promise.reject(customError);
    }
  },
  async updateUser(userId: string, data: any): Promise<UserI> {
    try {
      const { first_name, last_name, user_image, ...rest } = data;
      const resp = await User.findOneAndUpdate(
        { userId },
        {
          firstName: first_name,
          lastName: last_name,
          userImage: user_image,
          ...rest,
        },
        { new: true }
      );
      return resp;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.UPDATE_USER,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};

export default UserService;

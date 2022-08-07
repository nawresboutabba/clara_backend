import { UserResponse } from "../../controller/users";
import { UserI } from "../../models/users";
import { getSignedUrl } from "../../repository/repository.image-service";
import { genericArrayAreaFilter } from "./area";

export const lightUserFilter = async (user: UserI): Promise<any> => {
  const user_image = await getSignedUrl(user.userImage);
  return {
    user_id: user.userId,
    username: user.username,
    email: user.email,
    user_image,
    first_name: user.firstName,
    last_name: user.lastName,
    points: user.points,
  };
};
/**
 * User information filter.
 * Is used by controllers for return limited information in Response action.
 * This util is complemented with interface that finalize with "Response". For example UserResponse interface
 * @param user
 * @returns
 */
export const genericUserFilter = async (user: UserI): Promise<UserResponse> => {
  const { externalUser, active, points, firstName, lastName, email, username } =
    user;
  const area_visible = await genericArrayAreaFilter(user.areaVisible);
  const user_image = await getSignedUrl(user.userImage);
  return {
    user_id: user.userId,
    user_image,
    area_visible,
    external_user: externalUser,
    active,
    points,
    first_name: firstName,
    last_name: lastName,
    email,
    username,
  };
};

export const genericArrayUserFilter = async (
  users: Array<UserI>
): Promise<Array<UserResponse>> => {
  // this will not run, the function should receive the params
  // i not removed this code, because i am not confident with the code that uses this function
  if (!users) {
    return [];
  }

  return Promise.all(users.map(lightUserFilter));
};

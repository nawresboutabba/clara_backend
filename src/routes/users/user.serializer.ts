import { UserResponse } from "../../controller/users";
import { UserI } from "./user.model";
import { getSignedUrl } from "../../repository/repository.image-service";
import { genericArrayAreaFilter } from "../area/area.serializer";

export const lightUserFilter = async (user: UserI): Promise<UserResponse> => {
  const user_image = await getSignedUrl(user.userImage);
  return {
    user_id: user.userId,
    username: user.username,
    email: user.email,
    user_image,
    first_name: user.firstName,
    last_name: user.lastName,
    points: user.points,
    about: user.about,
    active: user.active,
    area_visible: genericArrayAreaFilter(user.areaVisible ?? []),
    external_user: user.externalUser,
    linkedIn: user.linkedIn,
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
  const {
    externalUser,
    active,
    points,
    firstName,
    lastName,
    email,
    username,
    linkedIn,
    about,
  } = user;

  const area_visible = genericArrayAreaFilter(user.areaVisible ?? []);
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
    linkedIn,
    about,
  };
};

export async function genericArrayUserFilter(users: Array<UserI>) {
  return Promise.all(users.map(lightUserFilter));
}

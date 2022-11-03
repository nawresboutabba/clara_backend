import { UserI } from "../routes/users/users.model";
import VisitService from "../services/Visit.service";
import { genericArrayVisitFilter } from "../utils/field-filters/visit";

/**
 * Function for get  latest ideas and challenges looking for.
 * @param query Has 2 values: init and offset
 * @param user
 * @returns
 */
export const getLatest = async (
  query: { init: number; offset: number },
  user: UserI
): Promise<any> => {
  try {
    const lastestVisit = await VisitService.getLastestVisitByUserId(
      user,
      query
    );

    const response = genericArrayVisitFilter(lastestVisit);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

import { ERRORS, HTTP_RESPONSE } from "../../constants";
import RoutingError from "../../handle-error/error.routing";
import { RequestMiddleware } from "../../middlewares/middlewares.interface";
import { SolutionI } from "../../routes/solutions/solution.model";
import { UserI } from "../../routes/users/user.model";
import SolutionService from "../../services/Solution.service";

export async function CAN_EDIT_SOLUTION(req: RequestMiddleware): Promise<void> {
  try {
    const solution: SolutionI = await SolutionService.getSolutionActiveById(
      req.params.solutionId
    );
    if (solution) {
      req.resources = { ...req.resources, solution };
    } else {
      return Promise.reject(
        new RoutingError(ERRORS.ROUTING.SOLUTION_FORBIDDEN, HTTP_RESPONSE._400)
      );
    }

    const user: UserI = req.user;

    if (user.userId === solution.author.userId) {
      /**
       * Check that user is author of solution
       */
      return Promise.resolve();
    } else if (
      solution.coauthor
        .map(function (e) {
          return e.userId;
        })
        .includes(user.userId)
    ) {
      /**
       * Check that user is coauthor of solution
       */
      return Promise.resolve();
    } else {
      return Promise.reject(
        new RoutingError(ERRORS.ROUTING.SOLUTION_FORBIDDEN, HTTP_RESPONSE._500)
      );
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

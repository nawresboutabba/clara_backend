/* eslint-disable @typescript-eslint/ban-ts-comment */
import { nanoid } from "nanoid";
import { BAREMO_STATUS, ERRORS, HTTP_RESPONSE } from "../constants";
import { BaremoResponse } from "../controller/baremo";
import {
  GroupValidatorBody,
  GroupValidatorQueueResponse,
} from "../controller/group-validator";
import { LightSolutionResponse } from "../controller/solutions";
import RepositoryError from "../handle-error/error.repository";
import { GroupValidatorI } from "../models/group-validator";
import { IntegrantI } from "../models/integrant";
import { BaremaI } from "../routes/barema/barema.model";
import {
  SolutionI,
  SOLUTION_STATUS_ENUM,
} from "../routes/solutions/solution.model";
import { genericArraySolutionsFilter } from "../routes/solutions/solution.serializer";
import BaremoService from "../services/Baremo.service";
import GroupValidatorService from "../services/GroupValidator.service";
import IntegrantService from "../services/Integrant.service";
import SolutionService from "../services/Solution.service";
import { genericGroupValidatorFilter } from "../utils/field-filters/group-validator";
import {
  genericArrayUserFilter,
  lightUserFilter,
} from "../routes/users/user.serializer";

export interface GroupValidatorResponse {
  group_validator_id: string;
  name: string;
  created: Date;
}

export const newGroupValidator = async (body: GroupValidatorBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      /**
       * Create new group validator variable
       */
      const groupValidator: GroupValidatorI = {
        groupValidatorId: nanoid(),
        name: body.name,
        created: new Date(),
      };
      /**
       * Get integrants for new Group Validator
       */
      const integrants: IntegrantI[] =
        await IntegrantService.getAllIntegrantsListById(body.integrants);

      const groupValidatorDocs = await GroupValidatorService.newGroupValidator(
        groupValidator
      );

      /**
       * Insert integrants to group validator
       */
      await IntegrantService.insertIntegrantsToGroupValidator(
        integrants,
        groupValidatorDocs
      );

      const resp = genericGroupValidatorFilter(groupValidatorDocs);
      return resolve(resp);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 * @TODO create dictionary type or similar for this response
 * @returns
 */
export const getAllGroupValidatorsDetails = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const groupValidators: IntegrantI[] =
      await IntegrantService.getAllActiveMembers();

    const grouping = groupValidators.reduce((groupingGV, item): any => {
      if (item.groupValidator) {
        const groupValidatorId = item.groupValidator.groupValidatorId;
        const groupDetails = {
          name: item.groupValidator.name,
          created: item.groupValidator.created,
        };
        groupingGV[groupValidatorId] = groupingGV[groupValidatorId] || {
          details: groupDetails,
          integrants: [],
        };
        const user = lightUserFilter(item.user);
        groupingGV[groupValidatorId].integrants.push(user);
      }
      return groupingGV;
    }, {});
    return resolve(grouping);
  });
};
/**
 * Get Ideas for give a resolution. The idea status must be READY_FOR_ANALYSIS or ANALYZING.
 * For each case it is necessary to know:
 * - READY_FOR_ANALYSIS: teams_members that opened the idea for analysis
 * - ANALYZING: teams_members who already confirmed the final analysis or did idea analysis opened
 * @param query
 * @param groupValidator
 * @returns
 */
export const getSolutionsLinked = async (
  query: any,
  groupValidator: GroupValidatorI
): Promise<GroupValidatorQueueResponse> => {
  try {
    /**
     * Get solutions ready for analysis
     */
    const solutions = await SolutionService.listSolutions(query, {
      groupValidator,
    });
    const resp: Array<LightSolutionResponse> =
      await genericArraySolutionsFilter(solutions);
    /**
     * Query for get TeamMembers of GroupValidator
     */
    const teamMembers = await IntegrantService.getIntegrantsOfGroupValidator(
      groupValidator
    );
    const usersTeamMembers = await genericArrayUserFilter(
      teamMembers.map((item) => item.user)
    );
    const queue = {
      group_validator_id: groupValidator.groupValidatorId,
      group_validator_name: groupValidator.name,
      step: query.status,
      integrants: usersTeamMembers,
      queue: undefined,
    };
    if (query.status == SOLUTION_STATUS_ENUM.enum.READY_FOR_ANALYSIS) {
      queue.queue = resp;
      return queue;
    } else if (query.status == SOLUTION_STATUS_ENUM.enum.ANALYZING) {
      /**
       * For each solution, get baremos started
       */
      const baremosPromises = solutions.map((solution) =>
        BaremoService.getAllBaremosBySolution(solution)
      );
      const baremos = await Promise.all(baremosPromises);

      /**
       * Create idea-baremo dictionary: {'xxdsdsdsdsass': [Array of baremos]}
       */
      const baremoDictionary = baremos.reduce((dictionary, current) => {
        if (current.length > 0) {
          const solutionId = current[0].solution.solutionId;
          dictionary[solutionId] = current;
          return dictionary;
        }
        return dictionary;
      }, {});
      /**
       * Compare baremos opened for validator team members.
       */
      const chis = resp.map((idea) => {
        /**
         * Get baremos relationated to idea
         */
        const baremosForIdea: BaremaI[] = baremoDictionary[idea.id];

        /**
         * Chech that exist baremos for this. Redundant
         */
        if (!baremosForIdea) {
          return false;
        }
        /**
         * Check validators that did a baremo for this idea
         */
        const usersWithBaremo = baremosForIdea.map((baremo: BaremaI) => {
          // @ts-ignore
          return baremo.user.userId;
        });

        const calification = usersTeamMembers.map((user) => {
          if (usersWithBaremo.includes(user.user_id)) {
            const baremoUser = baremosForIdea.filter(
              // @ts-ignore
              (baremo) => baremo.user.userId == user.user_id
            )[0];
            // @ts-ignore
            if (baremoUser.status == BAREMO_STATUS.ONGOING) {
              return {
                validator: user,
                done: false,
                status: BAREMO_STATUS.ONGOING,
              };
            } else {
              return {
                validator: user,
                done: true,
                status: BAREMO_STATUS.CLOSED,
              };
            }
          } else {
            return { validator: user, done: false };
          }
        });
        return {
          ...idea,
          baremos: calification,
        };
      });
      queue.queue = chis;
      return queue;
    }
  } catch (error) {
    return Promise.reject(
      new RepositoryError(
        ERRORS.REPOSITORY.IDEA_ANALYSIS_LISTING,
        HTTP_RESPONSE._500,
        error
      )
    );
  }
};

export const getBaremosLinkedToSolution = async (
  solution: SolutionI
): Promise<BaremoResponse[]> => {
  try {
    const baremos = await BaremoService.getAllBaremosBySolution(solution);
    const resp = baremos;
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

import Solution, { SolutionI } from "../models/situation.solutions";
import * as _ from "lodash";
import ServiceError from "../handle-error/error.service";
import { ERRORS, HTTP_RESPONSE } from "../constants";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import { UserI } from "../models/users";
import { AreaI } from "../models/organization.area";
import { NewSolutionI } from "../repository/repository.solution";
import { TagI } from "../models/tag";
import { removeEmpty } from "../utils/general/remove-empty";
import { UpdateQuery } from "mongoose";

export interface SolutionEditablesFields {
  title?: string;
  description?: string;
  images?: Array<string>;
  departmentAffected?: Array<AreaI>;
  status?: string;
  startAnalysis?: Date;
  isPrivated?: boolean;
  WSALevelChosed?: string;
}

const SolutionService = {
  async getSolutionActiveById(id: string): Promise<any> {
    const solution = await Solution.findOne({
      solutionId: id,
      active: true,
    })
      .populate("departmentAffected")
      .populate("updatedBy")
      .populate("challenge")
      .populate("author")
      .populate("coauthor")
      .populate("team")
      .populate("insertedBy")
      .populate("areasAvailable")
      .populate("groupValidator")
      .populate("tags")
      .populate("externalOpinion");
    return solution;
  },
  async deactivateSolution(solution: any, update: any): Promise<boolean> {
    try {
      await Solution.findOneAndUpdate(solution, update);
      return true;
    } catch (error) {
      return error;
    }
  },
  async newSolution(data: NewSolutionI): Promise<any> {
    try {
      const solution = await Solution.create(data);
      const resp = solution.populate("challenge");

      return resp;
    } catch (error) {
      return Promise.reject(
        new ServiceError(ERRORS.SERVICE.NEW_SOLUTION, HTTP_RESPONSE._500, error)
      );
    }
  },
  async updateSolutionPartially(
    solutionId: string,
    data: UpdateQuery<SolutionI>
  ): Promise<SolutionI> {
    try {
      return await Solution.findOneAndUpdate({ solutionId }, data, {
        new: true,
      })
        .populate("departmentAffected")
        .populate("updatedBy")
        .populate("challenge")
        .populate("author")
        .populate("coauthor")
        .populate("team")
        .populate("insertedBy")
        .populate("areasAvailable")
        .populate("tags")
        .populate("externalOpinion");
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.UPDATE_SOLUTION,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  /**
   * Solution List. Is used for solution without challenge associated too.
   * @param query
   * @param challengeId
   * @returns
   */
  async listSolutions(query: QuerySolutionForm, utils?: any): Promise<any> {
    try {
      const mongooseQuery = removeEmpty({
        title: { $regex: `.*${query.title}.*` },
        created: query?.created,
        active: true,
        status: query?.status,
        challengeId: query?.challengeId,
        tags: query?.tags,
        departmentAffected: query?.departmentAffected,
        groupValidator: utils?.groupValidator,
        type: query.type,
      });

      const solutions = await Solution.find(mongooseQuery)
        .skip(query.init)
        .limit(query.offset)
        /**
         * Filter order criteria unused
         */
        .sort(_.pickBy(query.sort, _.identity))
        .populate("team")
        .populate("insertedBy")
        .populate("areasAvailable")
        .populate("author")
        .populate("coauthor")
        .populate("groupValidator")
        .populate("challenge")
        .populate("tags")
        .populate("departmentAffected");
      return solutions;
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.GET_CHALLENGES_SOLUTIONS,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
  async getParticipations(user: UserI): Promise<any> {
    try {
      const solutions = await Solution.find({
        $and: [
          {
            active: true,
          },
          {
            $or: [
              // {
              //   insertedBy: user,
              // },
              {
                author: user,
              },
              {
                coauthor: { $in: user },
              },
            ],
          },
        ],
      })
        .populate("insertedBy")
        .populate("areasAvailable")
        .populate("author")
        .populate("coauthor")
        .populate("team")
        .populate("challenge");

      return solutions;
    } catch (error) {
      return Promise.reject(
        new ServiceError(
          ERRORS.SERVICE.SOLUTION_USER_PARTICIPATIONS,
          HTTP_RESPONSE._500,
          error
        )
      );
    }
  },
};
export default SolutionService;

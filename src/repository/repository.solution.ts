import { nanoid } from "nanoid";
import {
  ERRORS, HTTP_RESPONSE
} from "../constants";
import { BaremoResponse } from "../controller/baremo";
import { CommentBody, CommentResponse } from "../controller/comment";
import {
  EvaluationNoteResponse,
  LightSolutionResponse,
  SolutionBody,
  SolutionResponse
} from "../controller/solutions";
import RepositoryError from "../handle-error/error.repository";
import { BaremoI } from "../models/baremo";
import { EvaluationNoteI } from "../models/evaluation-note";
import { CommentScope, GeneralCommentI } from "../models/interaction.comment";
import { ChallengeI } from "../models/situation.challenges";
import { SolutionI, SOLUTION_STATUS } from "../models/situation.solutions";
import { TagI } from "../models/tag";
import { UserI } from "../models/users";
import BaremoService from "../services/Baremo.service";
import EvaluationNoteService from "../services/EvaluationNote.service";
import SolutionService, {
  SolutionEditablesFields
} from "../services/Solution.service";
import { genericBaremoFilter } from "../utils/field-filters/baremo";
import { genericCommentFilter } from "../utils/field-filters/comment";
import { genericEvaluationNoteFilter } from "../utils/field-filters/evaluation-note";
import {
  genericArraySolutionsFilter,
  genericSolutionFilter
} from "../utils/field-filters/solution";
import { getCurrentDate } from "../utils/general/date";
import { logVisit } from "../utils/general/log-visit";
import { QuerySolutionForm } from "../utils/params-query/solution.query.params";
import BaremoStateMachine from "../utils/state-machine/state-machine.baremo";
import SolutionStateMachine from "../utils/state-machine/state-machine.solution";
import {
  getComments,
  getCommentsWithoutRelation,
  newComment
} from "./repository.comment";

/**
 * This interface does not exactly correspond to a model,
 * because it is for the creation of an idea,
 * which may have missing attributes.
 * What is mandatory is that the attributes inserted here
 * are a subset of SolutionI
 */
export interface NewSolutionI {
  insertedBy: UserI;
  author: UserI;
  solutionId: string;
  active: boolean;
  created: Date;
  updated: Date;
  status: string;
  challenge: ChallengeI;
  version: number;
  type: string;
  /**
   * Configuration copy from Challenge as default. This copy is for manage custom
   * configuration by solution in the future
   */
  canChooseScope: boolean;
  canChooseWSALevel: boolean;
  WSALevelAvailable: string[];
}

export const createSolution = async (
  user: UserI,
  util: any,
  challenge: ChallengeI
): Promise<any> => {
  try {
    const insertedBy = user;
    /**
     * Solution have to have setted `author` or `team`.
     * If both are undefined or null, then throw error
     */
    const created = getCurrentDate();
    const data: NewSolutionI = {
      insertedBy,
      author: user,
      solutionId: nanoid(),
      created,
      active: true,
      updated: created,
      status: SOLUTION_STATUS.DRAFT,
      challenge,
      type: challenge.type,
      version: 0,
      /**
       * Configurations Settings
       */
      canChooseScope: challenge.canChooseScope,
      canChooseWSALevel: challenge.canChooseWSALevel,
      WSALevelAvailable: challenge.WSALevelAvailable,
    };
    const solution = await SolutionService.newSolution(data);

    const resp = await genericSolutionFilter(solution);
    return resp;
  } catch (error) {
    return Promise.reject(
      new RepositoryError(
        ERRORS.REPOSITORY.CREATE_SOLUTION,
        HTTP_RESPONSE._500,
        error
      )
    );
  }
};

export const updateSolution = async (
  body: SolutionBody,
  resources: any,
  user: UserI,
  utils: any
): Promise<SolutionResponse> => {
  try {
    const currentSolution = resources.solution;
    const change = {
      updatedBy: user,
      /**
       * Idea Form
       */
      title: body.title,
      description: body.description,
      proposedSolution: body.proposed_solution,
      differential: body.differential,
      isNewFor: body.is_new_for,
      wasTested: body.was_tested,
      testDescription: body.test_description,
      baremaTypeSuggested: body.barema_type_suggested,
      firstDifficulty: body.first_difficulty,
      secondDifficulty: body.second_difficulty,
      thirdDifficulty: body.third_difficulty,
      implementationTimeInMonths: body.implementation_time_in_months,
      impact: body.impact,
      moneyNeeded: body.money_needed,
      /**
       *
       */
      images: body.images,
      departmentAffected: utils.departmentAffected,
      isPrivated: body.is_privated,
      WSALevelChosed: body.WSALevel_chosed,
      tags: utils.tags,
      areasAvailable: utils.areasAvailable,
    };

    const solution = await SolutionService.updateSolutionPartially(
      currentSolution.solutionId,
      change
    );

    const resp = await genericSolutionFilter(solution);

    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteSolution = async (
  solutionId: string,
  user: UserI
): Promise<boolean> => {
  try {
    const solution = {
      solutionId: solutionId,
      active: true,
    };
    const update = {
      active: false,
      updatedBy: user,
      updatedAt: getCurrentDate(),
    };
    await SolutionService.deactivateSolution(solution, update);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSolution = async (
  solutionId: string,
  solution: SolutionI,
  user: UserI
): Promise<SolutionResponse> => {
  try {
    logVisit(user, solution);
    const resp = await genericSolutionFilter(solution);
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const listSolutions = async (
  query: QuerySolutionForm,
  utils?: any
): Promise<LightSolutionResponse[]> => {
  try {
    const listSolutions = await SolutionService.listSolutions(query, utils);
    /**
     * @TODO list solutions filter with minimal data
     */
    const resp = await genericArraySolutionsFilter(listSolutions);
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const newSolutionComment = async (
  comment: CommentBody,
  solution: SolutionI,
  user: UserI,
  utils: any
): Promise<CommentResponse> => {
  try {
    const parent = utils.parentComment;
    const com = await newComment({
      insertedBy: user,
      author: user,
      tag: utils.tagComment as TagI,
      scope: comment.scope as CommentScope,
      comment: comment.comment,
      resource: solution,
      parent: parent as GeneralCommentI,
    } as GeneralCommentI);
    const resp = await genericCommentFilter(com);
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getThread = async (utils: any): Promise<any> => {
  try {
    if (utils.childComment) {
      const resp = await genericCommentFilter(utils.childComment);
      return resp;
    } else {
      const filter = {
        commentId: utils.parentComment.commentId,
      };
      const comments = await getComments(filter);
      /**
       * Just exist a comment with his childs
       */
      return comments[0];
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSolutionComments = async (
  solution: SolutionI,
  query: any,
  user: UserI
): Promise<any> => {
  try {
    const filter = {
      solution,
      scope: query.scope,
    };

    // if(query.scope === COMMENT_LEVEL.GROUP && solution.status !== 'APPROVED_FOR_DISCUSSION'){
    //   const canViewComment = [
    //     ...solution.coauthor.map(coauthor => coauthor.userId),
    //     solution.author.userId,
    //     ...solution.externalOpinion.map(externalOpinion => externalOpinion.userId)
    //   ]
    //   if(canViewComment.includes(user.userId) == false){
    //     throw 'You are not authorized to see this comments'
    //   }
    // }
    const comments = await getComments(filter);
    return comments;
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function getSolutionCommentsWithoutRelations(solution: SolutionI) {
  const filter = {
    solution,
    scope: "GROUP",
  };

  return getCommentsWithoutRelation(filter);
}

export const newBaremo = async (
  solution: SolutionI,
  user: UserI,
  utils: any
): Promise<BaremoResponse> => {
  try {
    const date = getCurrentDate();
    const baremo: BaremoI = {
      baremoId: nanoid(),
      user,
      solution,
      created: date,
      updated: date,
      /**
       * Initial State
       */
      status: BaremoStateMachine.init(),
      type: utils.baremoType,
      comment: "",
    };

    if (solution.status == SOLUTION_STATUS.READY_FOR_ANALYSIS) {
      const updateSolution: SolutionEditablesFields = {
        status: SolutionStateMachine.dispatch(solution.status, "analyze"),
        startAnalysis: date,
      };
      await SolutionService.updateSolutionPartially(
        solution.solutionId,
        updateSolution
      );
    }

    const bar = await BaremoService.newBaremo(baremo);
    const baremoFiltered = await genericBaremoFilter(bar);

    return baremoFiltered;
  } catch (error) {
    return Promise.reject(
      new RepositoryError(
        ERRORS.REPOSITORY.NEW_BAREMO,
        HTTP_RESPONSE._500,
        error
      )
    );
  }
};

/**
 * Get current baremo for a solution X user. If not exist return undefined
 * @param solution
 * @param user
 * @returns
 */
export const getCurrent = async (
  solution: SolutionI,
  user: UserI
): Promise<BaremoResponse | void> => {
  try {
    const baremo = await BaremoService.getCurrentBaremoByUserAndSolution(
      solution,
      user
    );
    if (baremo) {
      const resp = genericBaremoFilter(baremo);
      return resp;
    }
    return undefined;
  } catch (error) {
    return Promise.reject(
      new RepositoryError(
        ERRORS.REPOSITORY.GET_BAREMO,
        HTTP_RESPONSE._500,
        error
      )
    );
  }
};

export const editBaremo = async (baremo: BaremoI, data: any): Promise<any> => {
  try {
    data = { ...data, updated: getCurrentDate() };
    const result = await BaremoService.updateBaremo(baremo, data);
    const res_filtered = await genericBaremoFilter(result);
    return res_filtered;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const newEvaluationNote = async (
  data: any,
  solution: SolutionI,
  user: UserI
): Promise<EvaluationNoteResponse> => {
  try {
    const date = getCurrentDate();
    const evaluationNote: EvaluationNoteI = {
      title: data.title,
      description: data.description,
      noteId: nanoid(),
      type: data.type,
      user,
      solution,
      created: date,
      updated: date,
    };
    const note = await EvaluationNoteService.newEvaluationNote(evaluationNote);
    const resp = await genericEvaluationNoteFilter(note);
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const applyTransition = async (
  data: any,
  solution: SolutionI
): Promise<any> => {
  try {
    const date = getCurrentDate();

    let update = {
      status: await SolutionStateMachine.dispatch(
        solution.status,
        data.transition
      ),
      updated: date,
      version: solution.version,
    };

    if (
      solution.status == SOLUTION_STATUS.DRAFT &&
      update.status == SOLUTION_STATUS.PROPOSED
    ) {
      const version = solution.version + 1;
      update = { ...update, version };
    }

    const resp = await SolutionService.updateSolutionPartially(
      solution.solutionId,
      update
    );
    const respFilterd = await genericSolutionFilter(resp);
    return respFilterd;
  } catch (error) {
    return Promise.reject(
      new RepositoryError(
        ERRORS.REPOSITORY.UPDATE_SOLUTION,
        HTTP_RESPONSE._500,
        error
      )
    );
  }
};

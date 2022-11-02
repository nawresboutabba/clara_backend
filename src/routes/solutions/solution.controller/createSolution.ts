import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import Challenge, { CHALLENGE_TYPE } from "../../challenges/challenge.model";
import Solution, { SOLUTION_STATUS } from "../solution.model";
import * as SolutionRep from "../solution.repository";
import { genericSolutionFilter } from "../solution.serializer";

export const createSolution = validate(
  {
    body: z.object({ challengeId: z.string().optional() }),
  },
  async ({ user, body }, res) => {
    const challenge = await Challenge.findOne(
      body.challengeId
        ? {
            _id: body.challengeId,
          }
        : {
            type: CHALLENGE_TYPE.GENERIC,
          }
    );

    const solution = await Solution.create({
      insertedBy: user,
      author: user,
      active: true,
      status: SOLUTION_STATUS.DRAFT,
      challenge,
      type: challenge.type,
      version: 0,
    });

    const createdSolution = await SolutionRep.getSolutionById(solution.id);

    return res.status(201).json(await genericSolutionFilter(createdSolution));
  }
);

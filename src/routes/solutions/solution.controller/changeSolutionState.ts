import { z } from "zod";
import { validate } from "../../../utils/express/express-handler";
import { genericSolutionFilter } from "../solution.serializer";
import SolutionStateMachine from "../../../utils/state-machine/state-machine.solution";
import { numberSchema } from "../../../utils/zod";
import { booleanSchema } from "../../../utils/zod/booleanSchema";
import { SOLUTION_STATUS } from "../solution.model";
import * as SolutionRep from "../solution.repository";

const solutionSchema = z.object({
  title: z.string(),
  description: z.string(),
  differential: z.string(),

  is_new_for: z.string(),

  was_tested: booleanSchema(z.boolean()),

  first_difficulty: z.string(),
  second_difficulty: z.string(),
  third_difficulty: z.string(),

  implementation_time_in_months: numberSchema(z.number()),
  money_needed: numberSchema(z.number()),

  is_privated: booleanSchema(z.boolean()),

  WSALevel_chosed: z.string(),

  images: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  department_affected: z.array(z.string()),
  file_complementary: z.array(z.string()),

  proposed_solution: z.string(),
  test_description: z.string(),
  barema_type_suggested: z.string(),
  impact: z.string(),

  participation: z.any(),

  strategic_alignment: z.string(),
});

export const changeSolutionState = validate(
  {
    params: z.object({ solutionId: z.string() }),
    body: z.object({
      state: z.enum([
        "confirm",
        "published",
        "analyze",
        "evaluate",
        "draft",
        "prepare",
        "approved",
      ]),
    }),
  },
  async ({ user, params, body }, res) => {
    const solution = await SolutionRep.getSolutionById(params.solutionId);

    if (solution.author.userId !== user.userId) {
      return res.status(403).json({ message: "not authorized" });
    }

    const parseResult = solutionSchema.safeParse(solution);
    if (parseResult.success === false) {
      return res.status(400).send({
        message: "solution is not completed",
        error: parseResult.error,
      });
    }

    const status = SolutionStateMachine.dispatch(solution.status, body.state);

    const updatedSolution = await SolutionRep.updateSolutionPartially(
      params.solutionId,
      {
        status,
        version:
          solution.status === SOLUTION_STATUS.DRAFT &&
          status === SOLUTION_STATUS.PROPOSED
            ? solution.version + 1
            : solution.version,
      }
    );

    return genericSolutionFilter(updatedSolution);
  }
);

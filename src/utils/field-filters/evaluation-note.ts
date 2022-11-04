import { EvaluationNoteResponse } from "../../controller/solutions";
import { EvaluationNoteI } from "../../models/evaluation-note";
import { lightSolutionFilter } from "../../routes/solutions/solution.serializer";
import { genericUserFilter } from "../../routes/users/user.serializer";

export const genericEvaluationNoteFilter = async (
  evaluationNoteEntity: EvaluationNoteI
): Promise<EvaluationNoteResponse> => {
  try {
    const solution = await lightSolutionFilter(evaluationNoteEntity.solution);
    const user = await genericUserFilter(evaluationNoteEntity.user);
    const resp = {
      note_id: evaluationNoteEntity.noteId,
      solution,
      user,
      title: evaluationNoteEntity.title,
      description: evaluationNoteEntity.description,
      created: evaluationNoteEntity.created,
      updated: evaluationNoteEntity.updated,
    };
    return resp;
  } catch (error) {
    return Promise.reject(error);
  }
};

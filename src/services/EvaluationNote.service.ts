import { ERRORS, HTTP_RESPONSE } from "../constants";
import ServiceError from "../handle-error/error.service";
import EvaluationNote, { EvaluationNoteI } from "../models/evaluation-note";

const EvaluationNoteService = {
  async newEvaluationNote(
    evaluationNote: EvaluationNoteI
  ): Promise<EvaluationNoteI> {
    try {
      const resp = await EvaluationNote.create({
        ...evaluationNote,
      });
      return resp.toObject();
    } catch (error) {
      throw new ServiceError(
        ERRORS.SERVICE.POST_EVALUATION_NOTE,
        HTTP_RESPONSE._500,
        error
      );
    }
  },
};
export default EvaluationNoteService;

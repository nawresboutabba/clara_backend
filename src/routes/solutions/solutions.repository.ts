import { FilterQuery, UpdateQuery } from "mongoose";
import Solution, { SolutionI } from "../../models/situation.solutions";
import { removeEmpty } from "../../utils/general/remove-empty";

export function getSolutionById(solutionId: string) {
  return Solution.findOne({ solutionId })
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
}

export function updateSolutionPartially(
  solutionId: string,
  data: UpdateQuery<SolutionI>
) {
  return Solution.findOneAndUpdate({ solutionId }, data, { new: true })
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
}

export function getSolutions(filterQuery: FilterQuery<SolutionI>) {
  return Solution.find(filterQuery)
    .populate("departmentAffected")
    .populate("challenge")
    .populate("author")
    .populate("coauthor")
    .populate("team")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("tags")
    .populate("groupValidator");
}

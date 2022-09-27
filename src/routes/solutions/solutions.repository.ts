import { FilterQuery, Types, UpdateQuery } from "mongoose";
import { WSALEVEL } from "../../constants";
import { CommentResponse } from "../../controller/comment";
import { CommentScope, SolutionComment } from "../../models/interaction.comment";
import { INVITATION_STATUS, SolutionInvitation } from "../../models/invitation";
import Solution, { SolutionI, SOLUTION_STATUS } from "../../models/situation.solutions";
import { TagI } from "../../models/tag";
import { UserI } from "../../models/users";
import { genericUserFilter } from "../../utils/field-filters/user";
import { removeEmpty } from "../../utils/general/remove-empty";
import { genericTagFilter } from "../tags/tags.serializer";

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

export async function canViewSolution(user: UserI, solution: SolutionI) {
  const haveInvites = await SolutionInvitation.find({
    to: user,
    resource: solution,
    status: INVITATION_STATUS.PENDING,
  }).count();

  const isAuthor = solution.author.userId === user.userId;
  const isInvited = haveInvites > 0;
  const isCoAuthor = solution.coauthor.some((e) => e.userId === user.userId);
  const isExternalOption = solution.externalOpinion.some(
    (e) => e.userId === user.userId
  );

  if (
    solution.status !== SOLUTION_STATUS.APPROVED_FOR_DISCUSSION &&
    !isInvited &&
    !isAuthor &&
    !isCoAuthor &&
    !isExternalOption
  ) {
    return false;
  }

  if (solution.status === SOLUTION_STATUS.APPROVED_FOR_DISCUSSION) {
    const hasCommonAreas = solution.areasAvailable.some((area) =>
      user.areaVisible.find((userArea) => userArea.areaId === area.areaId)
    );

    const hasWsaCompany = solution.WSALevelChosed == WSALEVEL.COMPANY;

    const hasWsaArea =
      solution.WSALevelChosed == WSALEVEL.AREA && hasCommonAreas === false;

    if (!hasWsaCompany && !hasWsaArea) {
      return false;
    }
  }

  return true;
}


type AggregatedData = {
  _id: Types.ObjectId
  comment: string
  tag: TagI
  parent: null | Types.ObjectId
  scope: string
  insertedBy: UserI
  author: UserI
  resource: Types.ObjectId
  type: 'ChallengeComment'
  createdAt: Date
  updatedAt: Date
  __v: number
  children: Array<AggregatedData>
}
export async function listSolutionComments({ solutionId, scope, commentId }: { solutionId: string; scope?: CommentScope; commentId?: string }) {
  const aggregatedData: AggregatedData[] = await SolutionComment.aggregate([
    {
      $match: removeEmpty({
        resource: Types.ObjectId.isValid(solutionId) ? new Types.ObjectId(solutionId) : solutionId,
        scope, parent: null,
        _id: commentId ? new Types.ObjectId(commentId) : null
      })
    },
    {
      $lookup: {
        from: "interactions",
        localField: "_id",
        foreignField: "parent",
        as: "children"
      }
    },
    {
      $lookup: {
        from: "tag",
        localField: "tag",
        foreignField: "_id",
        as: "tag"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" },
    // {
    //   $lookup: {
    //     from: "author.",
    //     localField: "author",
    //     foreignField: "_id",
    //     as: "author"
    //   }
    // },
    {
      $lookup: {
        from: "users",
        localField: "insertedBy",
        foreignField: "_id",
        as: "insertedBy"
      }
    },
    { $unwind: "$insertedBy" },
  ])

  return Promise.all(
    aggregatedData.map(async e => {
      const children = await Promise.all(
        e.children.map(async child => ({
          author: await genericUserFilter(child.author),
          tag: genericTagFilter(child.tag),
          id: child._id.toString(),
          comment: child.comment,
          scope: child.scope,
          parent: null,
        }) as CommentResponse)
      )
      return ({
        author: await genericUserFilter(e.author),
        tag: genericTagFilter(e.tag),
        id: e._id.toString(),
        comment: e.comment,
        scope: e.scope,
        parent: null,
        children
      });
    })
  )
}

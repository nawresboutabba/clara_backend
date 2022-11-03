import { Types, UpdateQuery } from "mongoose";
import { CommentResponse } from "../../controller/comment";
import { IntegrantStatusI } from "../../models/integrant";
import {
  ChallengeComment,
  CommentScope,
} from "../../models/interaction.comment";
import Challenge, { ChallengeI } from "./challenge.model";
import { TagI } from "../../models/tag";
import { UserI } from "../users/users.model";
import { genericUserFilter } from "../users/user.serializer";
import { removeEmpty } from "../../utils/general/remove-empty";
import { genericTagFilter } from "../tags/tags.serializer";

export function getChallengeById(challengeId: string) {
  return Challenge.findById(challengeId)
    .populate("author")
    .populate("coauthor")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("tags")
    .populate("departmentAffected")
    .populate("strategicAlignment")
    .populate("targetAudienceValue");
  // .populate("departmentAffected")
  // .populate("updatedBy")
  // .populate("challenge")
  // .populate("author")
  // .populate("coauthor")
  // .populate("team")
  // .populate("insertedBy")
  // .populate("areasAvailable")
  // .populate("tags")
  // .populate("externalOpinion");
}

export function updateChallengePartially(
  challengeId: string,
  data: UpdateQuery<ChallengeI>
) {
  return Challenge.findByIdAndUpdate(challengeId, data, { new: true })
    .populate("author")
    .populate("coauthor")
    .populate("insertedBy")
    .populate("areasAvailable")
    .populate("tags")
    .populate("departmentAffected")
    .populate("strategicAlignment");
}

export async function getChallengeActiveById(id: string) {
  const resp = await Challenge.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
        active: true,
        deletedAt: { $exists: false },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "insertedBy",
        foreignField: "_id",
        as: "insertedBy",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $lookup: {
        from: "groupvalidators",
        localField: "groupValidator",
        foreignField: "_id",
        as: "groupValidator",
      },
    },
    {
      $lookup: {
        from: "areas",
        localField: "departmentAffected",
        foreignField: "_id",
        as: "departmentAffected",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
    // {
    //   $lookup: {
    //     from: 'interactions',
    //     localField: "_id",    // field in the orders collection
    //     foreignField: "challenge",  // field in the items collection
    //     pipeline: [
    //       {
    //         $match: {
    //           $or: [{
    //             $or: [
    //               { author: user },
    //               { insertedBy: user }
    //             ]
    //           },
    //           { isPrivate: false },
    //           ]
    //         }
    //       }
    //     ],
    //     as: 'interactions'
    //   }
    // },
    // {
    //   $unwind: {
    //     path: "$groupValidator",
    //     preserveNullAndEmptyArrays: true
    //   }
    // },
    // {
    //   $unwind: {
    //     path: "$author",
    //     preserveNullAndEmptyArrays: true
    //   },
    // },
    // {
    //   $unwind: {
    //     path: "$insertedBy",
    //     preserveNullAndEmptyArrays: true
    //   },
    // }
  ]);
  return resp[0];
}

export async function canViewChallenge(
  user: UserI,
  challenge: ChallengeI,
  committee: IntegrantStatusI
) {
  if (committee.isActive) {
    return true;
  }

  if (challenge.status === "OPENED") {
    return true;
  }

  if (
    challenge.coauthor.map((coauthor) => coauthor.userId).includes(user.userId)
  ) {
    return true;
  }

  if (challenge.author.userId === user.userId) {
    return true;
  }

  return false;
}

type AggregatedData = {
  _id: Types.ObjectId;
  comment: string;
  tag: TagI;
  parent: null | Types.ObjectId;
  scope: string;
  insertedBy: UserI;
  author: UserI;
  resource: Types.ObjectId;
  type: "ChallengeComment";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  children: Array<AggregatedData>;
};
export async function listChallengeComments({
  challengeId,
  scope,
  commentId,
}: {
  challengeId: string;
  scope?: CommentScope;
  commentId?: string;
}) {
  const aggregatedData: AggregatedData[] = await ChallengeComment.aggregate([
    {
      $match: removeEmpty({
        resource: new Types.ObjectId(challengeId),
        scope,
        _id: commentId ? new Types.ObjectId(commentId) : null,
      }),
    },
    { $match: { $or: [{ parent: null }, { parent: { $exists: false } }] } },
    {
      $lookup: {
        from: "interactions",
        let: { parentId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$parent", "$$parentId"] } } },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
        ],
        as: "children",
      },
    },
    {
      $lookup: {
        from: "tags",
        foreignField: "_id",
        localField: "tag",
        as: "tag",
      },
    },
    { $unwind: "$tag" },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "users",
        localField: "insertedBy",
        foreignField: "_id",
        as: "insertedBy",
      },
    },
    { $unwind: "$insertedBy" },
  ]);

  return Promise.all(
    aggregatedData.map(async (e) => {
      const children = await Promise.all(
        e.children.map(
          async (child) =>
            ({
              author: await genericUserFilter(child.author),
              tag: genericTagFilter(child.tag),
              id: child._id.toString(),
              comment: child.comment,
              scope: child.scope,
              parent: null,
            } as CommentResponse)
        )
      );
      return {
        author: await genericUserFilter(e.author),
        tag: genericTagFilter(e.tag),
        id: e._id.toString(),
        comment: e.comment,
        scope: e.scope,
        parent: null,
        children,
      };
    })
  );
}

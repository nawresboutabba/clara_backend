import { Types } from "mongoose"
import { CommentResponse } from "../../controller/comment"
import { IntegrantStatusI } from "../../models/integrant"
import { ChallengeComment, CommentScope } from "../../models/interaction.comment"
import Challenge, { ChallengeI } from "../../models/situation.challenges"
import { TagI } from "../../models/tag"
import { UserI } from "../../models/users"
import { genericUserFilter } from "../../utils/field-filters/user"
import { removeEmpty } from "../../utils/general/remove-empty"
import { genericTagFilter } from "../tags/tags.serializer"

export async function getChallengeActiveById(id: string) {
  const resp = await Challenge.aggregate([
    { $match: { _id: new Types.ObjectId(id), active: true, deletedAt: { $exists: false } } },
    {
      $lookup: {
        from: "users",
        localField: "insertedBy",
        foreignField: "_id",
        as: "insertedBy"
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      },
    },
    {
      $lookup: {
        from: "groupvalidators",
        localField: "groupValidator",
        foreignField: "_id",
        as: "groupValidator"
      },
    },
    {
      $lookup: {
        from: "areas",
        localField: "departmentAffected",
        foreignField: "_id",
        as: "departmentAffected"
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags"
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
  ])
  return resp[0]

}

export async function canViewChallenge(user: UserI, challenge: ChallengeI, committee: IntegrantStatusI) {
  if (committee.isActive) {
    return true
  }

  if (challenge.status === "OPENED") {
    return true
  }

  if (challenge.externalOpinion.map(externalOpinion => externalOpinion.userId).includes(user.userId)) {
    return true
  }

  if (challenge.author.userId === user.userId) {
    return true
  }

  return false
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
export async function listChallengeComments({ challengeId, scope, commentId }: { challengeId: string; scope?: CommentScope; commentId?: string }) {
  const aggregatedData: AggregatedData[] = await ChallengeComment.aggregate([
    {
      $match: removeEmpty({ resource: new Types.ObjectId(challengeId), scope, parent: null, _id: commentId ? new Types.ObjectId(commentId) : null })
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

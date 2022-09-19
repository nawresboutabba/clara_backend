import Challenge from "../../models/situation.challenges"

export async function getChallengeActiveById(id: string) {
  const resp = await Challenge.aggregate([
    {
      $match: { $and: [{ challengeId: id, active: true }] },
    },
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

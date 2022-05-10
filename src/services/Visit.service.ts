import { ChallengeI } from "../models/situation.challenges";
import { SolutionI } from "../models/situation.solutions";
import { UserI } from "../models/users";
import Visit ,{ VisitI }from "../models/visit";

const VisitService = {
  async getLastestVisitByUserId (user: UserI, query: any): Promise<any> {
    const lastestVisit = await Visit.find({
      user: user._id,
    })
      .populate('resource')
      .skip(query.init)
      .limit(query.offset)
      .sort(query.order_by)
    return lastestVisit
  },
  async newVisit (user: UserI, resource: ChallengeI | SolutionI, date: Date ): Promise<void> {

    const visit = await Visit.findOneAndUpdate({
      user: user._id,
      resource: resource._id,
    },{
      visitDate: date
    })

    if(!visit) {
      Visit.create({
        user: user,
        resource: resource,
        visitDate: date
      })
      return Promise.resolve()
    }
    return Promise.resolve()
  }
}

export default VisitService;
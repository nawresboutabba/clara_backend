import { VisitResponse } from "../../controller/visit"
import { VisitI } from "../../models/visit"

export const genericVisitFilter = (visit: VisitI): VisitResponse => {
  try{
    const url = visit.resource.itemtype == "Challenge"? `/challenge/${visit.resource.challengeId}`: `/solution/${visit.resource.solutionId}`
    return ({
      visit_date: visit.visitDate,
      type: visit.resource.itemtype,
      resource :{
        title: visit.resource.title,
        description: visit.resource.description,
        url
      }
    })
  }catch(error){
    return error
  }
}

export const genericArrayVisitFilter = async (visits: VisitI[]): Promise<VisitResponse[]> => {
  const arrayVisit: Array<VisitResponse>= []
  if (!visits){
    return []
  }
  visits.forEach(visit => {
    arrayVisit.push(genericVisitFilter(visit))
  })
  return arrayVisit
}
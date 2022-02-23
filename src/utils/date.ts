import { DateTime } from 'luxon'

export default function toISOData (date?: Date ): Date {
  try{
    if(date){
      return DateTime.fromISO(date).toISODate()
    }
    throw new Error("Date is not defined")
  }catch(error){
    return error
  }

} 

export function getCurrentDate (): Date {
  return DateTime.local().toISODate()
}
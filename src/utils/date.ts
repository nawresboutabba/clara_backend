import { DateTime } from 'luxon'

export default function checkISOData (date?: Date ): boolean {
    try{
        if(date){
            return DateTime.fromISO(date).toISO() == date
        }
        return false
    }catch(error){
        return false
    }

} 
import * as _ from 'lodash';
import { InteractionBaseI } from '../../models/interaction.base';

export const interactionResume = (interactions: InteractionBaseI[]): Promise<{interaction:string, count: number}[]> => {
  try{
    const group = _.chain(interactions)

      .groupBy("type")

      .map((value, key) => ({ interaction: key, count: value.length }))
      .value()

    return group
  }catch(error){
    return Promise.reject(error)
  }
}
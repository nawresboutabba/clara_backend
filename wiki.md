# Wiki

  The purpose of this file is to have example patterns for development. If there are things to improve, etc.

## Groupping


```
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
```
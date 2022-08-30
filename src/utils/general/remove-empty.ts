import { pickBy } from "lodash";

export function removeEmpty<T>(obj: T): T {
  return pickBy(obj, (v) => v !== undefined && v !== null);
}

// function removeEmpty(obj: Record<string, unknown>) {
//   const newObj = {};
//   Object.keys(obj).forEach((key) => {
//     if (obj[key] === Object(obj[key])) {
//       newObj[key] = removeEmpty(obj[key]);
//     } else if (obj[key] !== undefined) {
//       newObj[key] = obj[key];
//     }
//   });
//   return newObj;
// }
